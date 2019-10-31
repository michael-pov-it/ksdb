const load_button = document.querySelector("#load_button");
const shows = document.querySelector("#show_list");

const baseURL = 'https://www.episodate.com/api';
const baseURLFilms = 'https://api.themoviedb.org/3/';
const APIkey = "56efa63592ffefd8febf4f5b71d1b709";
const SS = window.sessionStorage;

const base_tmdb = 'https://api.themoviedb.org/3/movie/';
const tmdb_apikey = '56efa63592ffefd8febf4f5b71d1b709';
const base_episodate = 'https://www.episodate.com/api/show-details?q='

const MINUTES_IN_HOUR = 60;

function delay() {
  return new Promise(resolve => setTimeout(resolve, 300));
}

setTimeout(() => {

  if (firebase.auth().currentUser == null) {
    location.reload();
  }

  // tmdb: https://api.themoviedb.org/3/movie/11?api_key=56efa63592ffefd8febf4f5b71d1b709
  // episodate: https://www.episodate.com/api/show-details?q=29560

  db.collection('users').where("email", "==", firebase.auth().currentUser.email).get()
  .then(snapshot => {
      var to_return;
      snapshot.docs.forEach(doc => {
          to_return = doc.data().shows;
      })
      return to_return;
  })
  .then(show_array => show_array.sort())
  .then(shows_list => {
    shows_list.forEach(data => {
      if (data.type == 'show') {
        fetch(base_episodate + data.id)
        .then(res => res.json())
        .then(res => printShow(res))
      } else if (data.type == 'film') {
        fetch(base_tmdb + data.id + '?api_key=' + tmdb_apikey)
        .then(res => res.json())
        .then(res => printFilm(res))
      }

      // fetch(BASE_URL + `/show/${showID}`) old
      // .then(res => res.json())
      // .then(res => printShow(res))
    })
  })
}, 900);
function printShow(params) {
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  const button = document.createElement('button');
  const hr = document.createElement('hr');
  const img = document.createElement('img');
  var showID = params.tvShow.id;
  var type = "Series";
  var title = params.tvShow.name;
  var rating = params.tvShow.rating;
  var EpDuration = params.tvShow.runtime;
  var imageSource = params.tvShow.image_path;
  img.src = imageSource;
  img.className = "poster_image_cabinet";
  button.className = "btn btn-primary";
  button.innerHTML = "REMOVE";
  button.addEventListener("click", removeShow(showID));
  div.className = "data_list";
  div.innerHTML = `<table><tr><td>Type: </td><td><span class="show_by_id_value">${type}</span></td></tr>
  <tr><td>Title: </td><td><span class="show_by_id_value">${title}</span></td></tr>
  <tr><td>Rating: </td><td><span class="show_by_id_value">${rating}</span></td></tr>
  <tr><td>Episode Duration: </td><td><span class="show_by_id_value">${EpDuration} minutes</span></td></tr></table>`;
  div.appendChild(img);
  div2.appendChild(div);
  div2.appendChild(button);
  shows.appendChild(hr);
  shows.appendChild(div2);
  shows.appendChild(hr);

}

function printFilm(params) {
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  const button = document.createElement('button');
  const hr = document.createElement('hr');
  var showID = params.id;
  var type = "Film";
  var title = params.title;
  var rating = params.vote_average;
  // var runtime = Math.round(params.runtime / MINUTES_IN_HOUR * 100) / 100;
  var runtime = params.runtime;
  button.className = "btn btn-primary";
  button.id = "remove_" + params.showID;
  button.innerHTML = "REMOVE";
  button.addEventListener("click", removeShow(showID));
  div.className = "data_list";
  div.innerHTML = `<table><tr><td>Type: </td><td><span class="show_by_id_value">${type}</span></td></tr>
  <tr><td>Title: </td><td><span class="show_by_id_value">${title}</span></td></tr>
  <tr><td>Rating: </td><td><span class="show_by_id_value">${rating}</span></td></tr>
  <tr><td>Runtime: </td><td><span class="show_by_id_value">${runtime} minutes</span></td></tr></table>`;
  div2.appendChild(div);
  div2.appendChild(button);
  shows.appendChild(hr);
  shows.appendChild(div2);
  shows.appendChild(hr);
  fetch(baseURLFilms + 'configuration?api_key=' + tmdb_apikey)
  .then(result => result.json())
  .then(config => {
    imageUrl = config.images.base_url + config.images.poster_sizes[2] + params.poster_path;
    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = "poster_image_cabinet";
    div.appendChild(img);
  })
}

function removeShow(showID) {
  return function() {
    db.collection('users').where("email", "==", firebase.auth().currentUser.email).get()
    .then(snapshot => {
      var to_return;
      snapshot.docs.forEach(doc => {
        to_return = doc.data().shows;
      })
      return to_return;
    })
    .then(array => array.filter(obj => obj.id != showID))
    .then(res => db.collection('users').where("email", "==", firebase.auth().currentUser.email).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var userRef = db.collection('users').doc(doc.id);
        return userRef.update({ shows: res })
        .then(function() {
          console.log("Document successfully updated!");
          location.reload();
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
      });
    }))
  }
}
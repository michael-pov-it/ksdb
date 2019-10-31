// import { QuerySnapshot } from "@google-cloud/firestore";

const button_films = document.querySelector('#button_films');
const button_series = document.querySelector('#button_series');
// const formId = document.querySelector('form#form_search_id');
// const formBtnAdd = document.querySelector('form#form_btn_add');
const searchInput = document.querySelector('input#search');
// const searchInputId = document.querySelector('input#search_id');
const resultsList = document.querySelector('#results-list');

// const BASE_URL = 'http://localhost:3000/api'

var firebaseConfig = {
    apiKey: "AIzaSyDN6LvVLpAaWqVVfLyqLV4VAzf4BNW7U9U",
    authDomain: "ksdb-dev1111.firebaseapp.com",
    databaseURL: "https://ksdb-dev1111.firebaseio.com",
    projectId: "ksdb-dev1111",
    storageBucket: "ksdb-dev1111.appspot.com",
    messagingSenderId: "42590703304",
    appId: "1:42590703304:web:24f4403f6502908c"
};

const baseURL = 'https://www.episodate.com/api';
const baseURLFilms = 'https://api.themoviedb.org/3/';
const APIkey = "56efa63592ffefd8febf4f5b71d1b709";
const SS = window.sessionStorage;

// TODO: fetch show list, push show id and service as object

function addFilm(id) {
  let usersRef = db.collection('users');
  let url = "".concat(baseURLFilms, 'movie/', id,'?api_key=', APIkey);
  let query = usersRef.where("email", "==", firebase.auth().currentUser.email);
  fetch(url)
    .then(result => result.json())
    .then(data => {
      query.get().then(QuerySnapshot => {
        QuerySnapshot.forEach(doc => {
          shows = doc.data().shows;
          shows.forEach(show => {
            if (show.id == data.id) {
              stop = true;
            }
          })
          if (!stop) {
            shows.push({id: data.id, type: 'film'});
            userRef = db.collection("users").doc(doc.id);
            userRef.update({
              shows: shows
            })
          }
        })
      })
    })
}

function addShow(id) {
  if (firebase.auth().currentUser) {
    let usersRef = db.collection('users');
    let query = usersRef.where("email", "==", firebase.auth().currentUser.email);
    let url = ''.concat(baseURL, '/show-details?q=', id);
    fetch(url)
    .then(result => result.json())
    .then(data => {
      query.get().then(QuerySnapshot => {
        QuerySnapshot.forEach(doc => {
          shows = doc.data().shows;
          stop = false;
          shows.forEach(show => {
            if (show.id == data.tvShow.id) {
              stop = true;
            }
          })
          if (!stop) {  
            shows.push({id: data.tvShow.id, type: 'show'});
            userRef = db.collection("users").doc(doc.id);
            userRef.update({
              shows: shows
            })
          }
        })
      })
    })
  } else {
    alert("FATAL ERROR"); // It is.
  }
}

if (SS.getItem("page") == null) {
  SS.setItem("page", 1);
}

let configData = null;
let baseImageURL = null;

const prevPageLink = document.createElement('a');
const nextPageLink = document.createElement('a');

let searchSeries = function(event) {
  if (event != undefined) {
    event.preventDefault();
  }
  if (SS.getItem("value") != searchInput.value) {
    SS.setItem("page", 1);
  }
  SS.setItem("value", searchInput.value);
  SS.setItem("pageChange", "series");

  let url = ''.concat(baseURL, '/search?q=', searchInput.value, '&page=', SS.getItem("page"))
  fetch(url)
  .then(result=>result.json())
  .then(query => {
    // resultsList.innerHTML = JSON.stringify(data, null, 4) // Output JSON
    resultsList.innerHTML = '';
    prevPageLink.id = "prev_page";
    nextPageLink.id = "next_page";
    prevPageLink.innerHTML = "Go to previous page";
    nextPageLink.innerHTML = "Go to next page";
    prevPageLink.href = "#";
    nextPageLink.href = "#";
    query.tv_shows.forEach(show => {
      var li = document.createElement('li');
      var img = document.createElement('img');
      var a = document.createElement('a');
      var br = document.createElement('br');
      var hr = document.createElement('hr');
      var btn = document.createElement('button');


      li.appendChild(img);
      img.src = show.image_thumbnail_path;
      img.classList.add('found_image');
      a.textContent = show.name;
      // a.href = '/show.html?imdbID=' + show.title;
      a.href = '#'
      li.appendChild(a);
      li.appendChild(br);
      li.appendChild(btn);
      li.appendChild(hr);
      btn.classList.add('add_show');
      btn.classList.add('btn');
      btn.classList.add('btn-primary');
      btn.innerHTML = 'ADD';
      btn.onclick = () => {addShow(show.id)}
      btn.setAttribute("data-id", show.id);
      resultsList.appendChild(li);
    });
    if (SS.getItem("page") > 1) {
      resultsList.appendChild(prevPageLink);
    }
    if (SS.getItem("page") < query.pages - 1) {
      resultsList.appendChild(nextPageLink);
    }
  })
}

let searchFilms = function(event) {
  if (event != undefined) {
    event.preventDefault();
  }
  if (SS.getItem("value") != searchInput.value) {
    SS.setItem("page", 1);
  }
  SS.setItem("value", searchInput.value);
  SS.setItem("pageChange", "films");

  let url = "".concat(baseURLFilms, 'configuration?api_key=', APIkey);
  fetch(url)
  .then(result => result.json())
  .then(data => {
    baseImageURL = data.images.secure_base_url;
    configData = data.images;
    console.log('config: ',  data);
    console.log('config fetched');
    return configData
  })
  .then(config => {
    let url = ''.concat(baseURLFilms, 'search/movie?api_key=', APIkey, '&query=', searchInput.value, '&page=', SS.getItem("page"))
    fetch(url)
    .then(result=>result.json())
    .then(result=>{
      console.log(result);
      return result;
    })
    .then(query => {
      // resultsList.innerHTML = JSON.stringify(data, null, 4) // Output JSON
      resultsList.innerHTML = '';
      prevPageLink.id = "prev_page";
      nextPageLink.id = "next_page";
      prevPageLink.innerHTML = "Go to previous page";
      nextPageLink.innerHTML = "Go to next page";
      prevPageLink.href = "#";
      nextPageLink.href = "#";
      query.results.forEach(show => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        const a = document.createElement('a');
        const hr = document.createElement('hr');
        const btn = document.createElement('button');
        var br = document.createElement('br');

        li.appendChild(img);
        img.src = config.secure_base_url + config.poster_sizes[0] + show.poster_path;
        img.classList.add('found_image');
        a.textContent = show.title;
        // a.href = '/show.html?imdbID=' + show.title;
        a.href = '#'
        li.appendChild(a);
        li.appendChild(br);
        li.appendChild(btn);
        li.appendChild(hr);
        btn.classList.add('add_show');
        btn.setAttribute("data-id", show.id);
        btn.classList.add('btn');
        btn.classList.add('btn-primary');
        btn.innerHTML = 'ADD';
        btn.onclick = () => {addFilm(show.id)}
        resultsList.appendChild(li);
      });
      if (SS.getItem("page") > 1) {
        resultsList.appendChild(prevPageLink);
      }
      if (SS.getItem("page") < query.total_pages - 1) {
        resultsList.appendChild(nextPageLink);
      }
    })
  })
}


button_series.addEventListener('click', searchSeries);
button_films.addEventListener('click', searchFilms);

if (SS.getItem("pageChange") == 'series') {
  searchInput.value = SS.getItem("value");
  searchSeries();
} else if (SS.getItem("pageChange") == 'films') {
  searchInput.value = SS.getItem("value");
  searchFilms();
}

nextPageLink.onclick = function(event) {
  SS.setItem("page", parseInt(SS.getItem("page"), 10) + 1);
  location.reload();
}

prevPageLink.onclick = function(event) {
  SS.setItem("page", parseInt(SS.getItem("page"), 10) - 1);
  location.reload();
}
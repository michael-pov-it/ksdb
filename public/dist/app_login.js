// const registerForm = document.querySelector("form#form_register");
// const loginForm = document.querySelector("form#form_login");
// const registerBtn = document.querySelector("input#register_button");
// const registerLogin = document.querySelector("#input_login_r");
// const loginLogin = document.querySelector("#input_login");
// const loginPassword = document.querySelector("input#input_password");
// const registerPassword = document.querySelector("input#input_password_r");
// const registerPasswordConfirm = document.querySelector("input#input_password_r_confirm");
const btnLogin = document.getElementById('google_link')
const btnLogout = document.getElementById('logout_link')
const btnDelete = document.getElementById('delete_link')
var provider = new firebase.auth.GoogleAuthProvider();

const token = "AIzaSyDN6LvVLpAaWqVVfLyqLV4VAzf4BNW7U9U";

var firebaseConfig = {
    apiKey: token,
    authDomain: "ksdb-dev1111.firebaseapp.com",
    databaseURL: "https://ksdb-dev1111.firebaseio.com",
    projectId: "ksdb-dev1111",
    storageBucket: "ksdb-dev1111.appspot.com",
    messagingSenderId: "42590703304",
    appId: "1:42590703304:web:24f4403f6502908c"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
db = firebase.firestore();

// loginForm.addEventListener("submit", loginSubmitted)
if (btnLogin != undefined) {
  btnLogin.addEventListener("click", googleAuth)
} else if (btnLogout != undefined) {
  btnLogout.addEventListener("click", () => {
    firebase.auth().signOut();
  });
  // btnDelete.addEventListener("click", () => {
  //   db.collection('users').where("email", "==", firebase.auth().currentUser.email).get()
  //   .then(snapshot => {
  //     var to_return;
  //     snapshot.docs.forEach(doc => {
  //         doc.delete()
  //     })
  //   })
  // }) TODO 
} else {
  alert("Some real bad stuff");
}

function changeUser(loginStatus, email = 'Logged out!') {
  fetch("/setuser",
  {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({status: loginStatus, email: email})
  })
  .then(res => res.json())
  .then(console.log)
  .then(res => res.ok)
  .catch(function(res){ console.log(res) })
}

var loadsCounter = 0; // Каждый раз, когда страница перезагружается
// она запускает функцию снизу 1 раз
// Я хочу обновлять страницу только когда пользователь
// Вручную входит/выходит, чтобы обновить

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    var email = user.email;
    console.log(`User '${email}' is logged in!`);
    // userBool = user ? true : false;
    // ...
    changeUser(true, email);
    if (loadsCounter > 0) {
      if (document.location.href == "http://localhost:3000" || document.location.href == "http://localhost:3000/") {
        location.reload();
      }
      document.location.href = "http://localhost:3000/dashboard";
    }
    loadsCounter++;
  } else {
    console.log(`User is logged out!`);
    // User is not signed in
    // ...
    changeUser(false);
    if (loadsCounter > 0) {
      if (document.location.href == "http://localhost:3000/" || document.location.href == "http://localhost:3000") {
        location.reload();
      } else {
        document.location.href = "http://localhost:3000/";
      }
    }
    loadsCounter++;
  }
});

// function loginSubmitted(event) {
//     event.preventDefault();
//     firebase.auth().signInWithEmailAndPassword(loginLogin.value, loginPassword.value);
// }

function googleAuth(event) {
  event.preventDefault();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var email = result.user.email;
    // ...
    db.collection('users').where("email", "==", email).get()
    .then(doc => {
      if (!doc.exists) {
        db.collection('users').add({
          email: email,
          shows: []
        })
      }
    })

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    console.error(`Error code: ${errorCode} \n
                  Message: ${errorMessage} \n
                  Email: ${email}`);
    });
}

// var user = firebase.auth().currentUser;

// // var name, email, photoUrl, uid, emailVerified;

// if (user != null) {
//   name = user.displayName;
//   email = user.email;
//   photoUrl = user.photoURL;
//   emailVerified = user.emailVerified;
//   uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
//                    // this value to authenticate with your backend server, if
//                    // you have one. Use User.getToken() instead.
// }
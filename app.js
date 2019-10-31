const createError = require('http-errors');
const express = require('express');
const sm = require('sitemap');
const path = require('path');
const logger = require('morgan');
// const session = require("express-session");
const cors = require('cors');
var admin = require('firebase-admin');
var bodyParser = require('body-parser');

const dashboardRouter = require("./routes/dashboard");
const publicRouter = require("./routes/public.js");
const logoutRouter = require("./routes/logout.js");
const cabinetRouter = require("./routes/cabinet.js");
// const serverRouter = require("./server/index.js");

class User {
  constructor(loginStatus) {
    this.loginStatus = loginStatus;
  }
  setLoginStatus(req) {
    // if (req == true && this.loginStatus == true) {
    //   throw new Error("Already logged in!");
    // }
    // if (req == false && this.loginStatus == false) {
    //   throw new Error("Please, <a href='/users/login/'> log in</a>! ");
    // }
    this.loginStatus = req;
  };
  getLoginStatus() {
    return this.loginStatus;
  };
}
user = new User(false)
var email = "Wait for it...";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://ksdb-dev1111.firebaseio.com'
});

const app = express();
const sitemap = sm.createSitemap ({
  hostname: 'http://localhost:3000',
  cacheTime: 600000,        // 600 sec - cache purge period
  urls: [
    { url: '/',  changefreq: 'daily', priority: 0.3 },
    { url: '/dashboard',  changefreq: 'daily',  priority: 0.7 }
  ]
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = user;
  req.email = email;
  next();
});
app.use('/logout', logoutRouter);
app.use('/', publicRouter);
app.use('/dashboard', dashboardRouter);
app.use('/cabinet', cabinetRouter);
// app.use('/api', serverRouter);
app.get('/sitemap.xml', function(req, res) {
  sitemap.toXML( function (err, xml) {
      if (err) {
        return res.status(500).end();
      }
      res.header('Content-Type', 'application/xml');
      res.send( xml );
  });
});
app.post('/setuser', function (req, res) {
  console.log('userStatus ' + req.body.status)
  if (req.body.status == true) {
    user.setLoginStatus(true);
    email = req.body.email;
    console.log('user logged in!')
  } else {
    user.setLoginStatus(false);
    email = req.body.email;
    console.log('user logged out!')
  }
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
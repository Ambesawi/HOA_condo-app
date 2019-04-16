require("dotenv").config();
var express = require("express");
var app = express();
var routes = require('./routes');
var PORT = process.env.PORT || 3001;
var cookieParser = require('cookie-parser');
var session  = require('express-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var db = require("./models");
// var passport = require('./config/passport/passport.js');
var passport = require('./passport');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(morgan('dev')); //log every request to the console

//for bodyParsar
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// required for passport
// add & configure middleware
app.use(session({
  // genid: (req) => {
  //   console.log('Inside the session middleware')
  //   console.log(req.sessionID)
  //   // return uuid() // use UUIDs for session IDs
  // },
	secret: 'condoapp',
	resave: false,
	saveUninitialized: true
 } )); // session secret
 //Passport
app.use(passport.initialize());
app.use(passport.session()); 


// Routes
app.use(routes);
require("./routes/apiRoutes.js")(app);
require("./routes/user.js")

var syncOptions = { force: false };

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;

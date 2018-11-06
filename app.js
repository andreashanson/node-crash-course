var express = require("express");
var bodyParser = require("body-parser");
var path = require("path"); //Core module don't need to install seperatly
var expressValidator = require('express-validator');

var app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Custom middleware for test and show how it works
/*
var logger = function(req, res, next) {
  console.log("LOGGING");
  next();
}
app.use(logger);
*/

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});


app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg : msg,
      value : value
    }
  }
}))

let users = [];

app.post('/users/add', function(req, res) {

  req.checkBody('first_name', 'First name is req').notEmpty();
  req.checkBody('last_name', 'Last name is req').notEmpty();
  req.checkBody('email', 'Email name is req').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    console.log("ERRORS");
    console.log(errors);
    res.render("index", {errors, users});
  }
  else {
    var newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    }
    console.log("SUCCESS");
    console.log(newUser);
    users.push(newUser);
    res.render("index", {users});
  }
});

app.get('/', function(req, res) {
  res.render("index", {
    users
  });

});
app.listen(PORT, function() {
  console.log("Server started on port " + PORT);
});


//Middleware are functions that har access to the response and request object.

// Om du skapar en index.html i din public static folder och du även har en route för index på samma med en exempelvis res.send() så kommer den alltid overrideas av public static folder grejset.

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs  = require('express-handlebars');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// var axios = require("axios");
// var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3001;

// Initialize Express
var app = express();

// view engine setup
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Define our routes
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/tbd", { useNewUrlParser: true });

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

var con = mongoose.connection;
con.on('error', console.error.bind(console, 'connection error:'));
con.once('open', function callback () {
  console.log("Database Connected, Ready State: " + mongoose.connection.readyState);
});

// Routes
app.get("/home", htmlRoutes.home);
app.get("/scrape", apiRoutes.scrape);
app.get("/home", apiRoutes.retrieveAll);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

module.exports = app;
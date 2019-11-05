var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs  = require('express-handlebars');
var axios = require("axios");
var db = require("./models");
var cheerio = require("cheerio");

var PORT = 3001;
var app = express();


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var apiRoutes = require('./routes/apiRoutes')(app);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

var con = mongoose.connection;
con.on('error', console.error.bind(console, 'connection error:'));
con.once('open', function callback () {
  console.log("Database Connected, Ready State: " + mongoose.connection.readyState);
});



// app.get('/', function (req, res) {
//   res.render('home');
// });




app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
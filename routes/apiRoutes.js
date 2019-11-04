var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {
    
    app.get("/", function(req, res)  {
        res.render('home');
    });

    app.get("/home", function(req, res) {
        db.Article.find({}).populate("note")
        .then(function(dbArticle) {
            if(dbArticle){
                res.render('home', {
                    dbArticle: dbArticle
                });
            }else{
                res.render('home')
            }
        })
        .catch(function(err) {
            console.log(err);
        });
    });

        // First, we grab the body of the html with axios
        app.get("/scrape", function(req, res)  {    
            axios.get("http://www.echojs.com/").then(function(response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
          
            // Now, we grab every h2 within an article tag, and do the following:
            $("article h2").each(function(i, element) {
            // Save an empty result object
            var result = {};
          
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
          
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
                })
                .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
                });
            })
            res.send("Scrape Complete");
          });
          });
    // app.get("/articles", function(req, res) {
    //     // Grab every document in the Articles collection
    //     db.Article.find({})
    //     .then(function(dbArticle) {
    //         // If we were able to successfully find Articles, send them back to the client
    //         res.json(dbArticle);
    //     })
    //     .catch(function(err) {
    //         // If an error occurred, send it to the client
    //         res.json(err);
    //     });
    // }),
    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
          // ..and populate all of the notes associated with it
          .populate("note")
          .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      
      });
};
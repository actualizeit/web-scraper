var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

var util = require('util')

module.exports = function (app) {
    
    app.get("/", function(req, res)  {
        res.render('home');
    });

    app.get("/home", function(req, res) {
        db.Article.find({}).populate("note")
        .then(function(dbArticle) {
            console.log(dbArticle)
            const currentArticles = [];
            for(let i=0; i < 20; i++){
                currentArticles.push(dbArticle[i])
            }
            console.log("test: " + currentArticles)
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

    app.put("/clear", function(req, res) {
        db.Article.remove({})
        .then(db.Note.remove({}))
        .then(function() {
            window.location.reload();
        });
    });

        app.get("/scrape", function(req, res)  { 
            console.log("scrapin")   
            axios.get("https://www.reddit.com/r/Futurology/").then(function(response) {
                var $ = cheerio.load(response.data);
                var DBCheck = 0;
                $("._2INHSNB8V5eaWp4P0rY_mE").each(function(i, element) {
                    var result = {}
                    result.headline = $(element).text()
                    result.link = $(element).children().attr("href");
                    console.log(result)
                    db.Article.find({})
                    .then(function(data){
                        console.log(data)
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].headline !== result.headline) {
                                DBCheck++
                            }
                        }
                        if(DBCheck === data.length){
                            db.Article.create(element)
                            .then(function(element) {
                                console.log(element);
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                            DBCheck = 0;
                        }else{
                            DBCheck = 0;
                        }
                    })
                })
                console.log("Scrape Complete");
            })
        })

                // $("._eYtD2XCVieq6emjKBH3m")


        app.get("/articles", function(req, res) {
            // Grab every document in the Articles collection
            db.Article.find({})
            .then(function(dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
        }),
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
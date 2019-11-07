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

    app.put("/clearArticles", function(req, res) {
        db.Article.remove({})
        .then(function(){
            location.reload();
        });
    });

    app.put("/clearNotes", function(req, res) {
        console.log("clear notes hit")
        db.Note.remove({})
        .then(function(){
            location.reload();
        });
    });

    app.get("/scrape", function(req, res)  { 
        console.log("scrapin")   
        axios.get("https://www.reddit.com/r/Futurology/").then(function(response) {
            var $ = cheerio.load(response.data);
            var DBCheck = 0;
            $("._2INHSNB8V5eaWp4P0rY_mE").each(function(i, element) {
                var title = $(element).text()
                var link = $(element).attr("href");
                var result = {title, link}
                console.log(result)
                db.Article.find({})
                .then(function(data){
                    console.log(data)
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].headline !== result.headline) {
                            DBCheck++
                        }
                    }
                    console.log(DBCheck)
                    if(DBCheck === data.length){
                        console.log("passed")
                        db.Article.create(result)
                        .then(function(dbEntry) {
                            console.log(dbEntry);
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

    app.get("/saved/", function(req, res) {
    db.Article.find({saved: true}).sort({created: -1}).limit(20).populate("note")
    .then(function(dbArticle) {
        res.render("saved", {
            title: "Stuff you thought was cool I guess",
            dbArticle: dbArticle
        });
    })
    .catch(function(error) {
        if(error) {
            console.log(error);
        }
    });
    });

    app.put("/article/:id", function(req, res) {
        var id = req.params.id;
        db.Article.findOneAndUpdate({_id: id}, {$set: {saved: true}})
        .then(function(art) {
            res.json(art);
        })
        .catch(function(err) {
            res.end(err);
        });
    });

    app.post("/notes/:id", function(req, res) {
        var title = req.body.noteTitle
        var body = req.body.noteBody
        var article = req.params.id;
        var note = {title, body, article}
        db.Note.create(note)
        .then(function(note) {
            console.log(note);
        })
        .catch(function(err) {
            res.end(err);
        });
    });

    app.get("/notes/:id", function(req, res) {
        console.log("notes called")
        var articleID = req.params.id;
                // .sort({created: -1}).limit(20)
        db.Note.find({article: articleID})
        .then(function(notes) {
            console.log(notes);
        })
        .catch(function(err) {
            res.end(err);
        });
    });
};
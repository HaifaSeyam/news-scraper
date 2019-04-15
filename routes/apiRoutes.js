var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");

module.exports = function(app) {
  //scraping ...
app.get("/scrape", function(req, res) {
  axios.get("https://www.nytimes.com/section/technology").then(function(response) {
    var $ = cheerio.load(response.data);
    var articles = [];
    var url = "https://www.nytimes.com";

    $("article").each(function(i, element) {

      var result = {}
      
      result.title = $(this).children("div").find("h2").find("a").text();
      result.link = url + $(this).children("figure").find("a").attr("href");
      result.imgSrc = $(this).children("figure").find("a").find("img").attr("src");

      articles.push(result);
    })

      db.Article.create(articles)
      .then(function(dbArticle) {
        console.log(dbArticle);
      })
      .catch(function(err) {
        console.log(err);
      });
    });

      res.render("index");
    });

    //grabing all articles ...
    app.get("/articles", function(req, res) {
      db.Article.find({})
        .then(function(dbArticle) {
          res.json(dbArticle);
          console.log(dbArticle)
        })
        .catch(function(err) {
          res.json(err);
        });
    });

    //save articles ...
    app.put("/saved/:id", function(req, res) {
      db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { isSaved: true } })
        .then(function (dbArticle) {
          res.json(dbArticle);
        })
        .catch(function (err) {
          res.json(err);
        });
    });

    //delete articles ...
    app.delete("/delete/:id", function(req, res) {
      db.Article.deleteOne({ _id: req.params.id }, function(error, data) {
              if (error) {
                console.log(error);
              } else {
                res.json(data);
              }
          });
    });

    //grab all notes ...
    app.get("/note/:id", function(req, res) {
        db.Article.findOne({ _id: req.params.id })
          .populate("note")
          .then(function(dbArticle) {
            console.log(dbArticle);
            res.json(dbArticle);
          })
          .catch(function(err) {
            res.json(err);
          });
        });
    
    //add notes ...
    app.post("/addNote/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
    });

    //delete notes ...
    app.delete("/deleteNote/:id", function(req, res) {
    db.Note.deleteOne({ _id: req.params.id }, function(error, data) {
            if (error) {
              console.log(error);
            } else {
              res.json(data);
            }
        });
    });
}
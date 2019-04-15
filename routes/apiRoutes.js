var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");

module.exports = function(app) {
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/section/technology").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var articles = [];
    var url = "https://www.nytimes.com";

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {

      var result = {}
      
      result.title = $(this).children("div").find("h2").find("a").text();
      result.link = url + $(this).children("figure").find("a").attr("href");
      result.imgSrc = $(this).children("figure").find("a").find("img").attr("src");

      articles.push(result);
    })

    return articles;

  }).then(function(articles){
    // Create a new Article using the `result` object built from scraping
    // db.Article.create(articles)
    // .then(function(dbArticle) {
    //   // View the added result in the console
      console.log(articles);
      res.json(articles);
    })
    .catch(function(err) {
      // If an error occurred, log it
      console.log(err);
        });
 
    });

app.post("/saved", function(req, res) {
    var article = req.body;
    db.Article.create(article, function(error, data) {
            if (error) {
               console.log(error)
            }
            res.json(data);
        });
  });

app.delete("/delete/:id", function(req, res) {
  var id = req.params.id;
  db.Article.deleteOne({ _id: id }, function(error, data) {
          if (error) {
            console.log(error);
          } else {
            res.json(data);
          }
      });
});

app.get("/displayNotes/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      console.log(dbArticle); //note array is empty???
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/addNotes/:id", function(req, res) {
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

app.delete("/deleteNote/:id", function(req, res) {
  var id = req.params.id;
  db.Note.deleteOne({ _id: id }, function(error, data) {
          if (error) {
            console.log(error);
          } else {
            res.json(data);
          }
      });
});


}

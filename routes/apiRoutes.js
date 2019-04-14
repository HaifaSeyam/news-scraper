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
    db.Article.create(articles)
    .then(function(dbArticle) {
      // View the added result in the console
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, log it
      console.log(err);
        });
  });
    });
};

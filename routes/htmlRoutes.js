var db = require("../models");

module.exports = function(app) {
   // Load index page
   app.get("/", function(req, res) {
    res.render("index", {
      title: "Home | NYT News Scraper"
    });
  });

    // Load saved articles page
    app.get("/saved", function(req, res) {
      db.Article.find({}, function(error, data) {
        
        if (error) {
           console.log(error)
        } else {
          res.render("saved", {
            title: "Saved Articles | NYT News Scraper",
            data: data
          });
        }
    });
      
    });

};




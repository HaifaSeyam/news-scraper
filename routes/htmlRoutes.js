var db = require("../models");

module.exports = function(app) {
   // Load index page
   app.get("/", function(req, res) {
    res.render("index", {
      title: "Home | NYT News Scraper"
    });
  });

   // Load saved page
   app.get("/saved", function(req, res) {
    res.render("saved", {
      title: "Saved Articles | NYT News Scraper"
    });
  });
};

var express = require("express");
var exphbs = require("express-handlebars");
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");


var db = require("./models");

var app = express();
var PORT = process.env.PORT || 8080;

// Middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

var hbHelpers = require("./views/helpers/hbHelpers.js");

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      debug: hbHelpers.debug
    }
  })
);
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI);

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, function() {
  console.log("Listening on port:" + PORT + "Visit http://localhost:/" +  PORT + "in your browser.");
});

module.exports = app;



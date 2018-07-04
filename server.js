var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

const PORT = process.env.PORT || 3010;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB

// mongoose.connect("mongodb://localhost/mongoscraperHW");
mongoose.connect("mongodb://<heroku_rbk5qptz>:<>@ds125031.mlab.com:25031/heroku_rbk5qptz");
// Routes
//https://www.easyphonenumberlookups.com/323-205
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  //how to get all the listing in different pages?
  //how to get the listing from the most popular?
  //how to download images?
  axios.get("https://www.houzz.com/products/wall-and-floor-tile/p/90").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("div.hz-product-card").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("div.hz-product-card__meta-container")
        .children("div.hz-product-card__meta")
        .children("a")     
        .text();
      result.category = $(this)
        .find("img")
        .attr("alt");
      result.manufacturer = $(this)
        .children("div.hz-product-card__meta-container")
        .children("div.hz-product-card__meta")
        .children("div.hz-product-card__product-manufacturer")     
        .text();

      var listprice = $(this)
      .children("div.hz-product-card__meta-container")
      .children("div.hz-product-card__meta")
      .children("div.hz-product-price")
      .children("a.hz-product-price__final")     
      .text();
      
      if (listprice!= '') {
        result.price = listprice;
      } else {

        result.price = $(this)
          .children("div.hz-product-card__meta-container")
          .children("div.hz-product-card__meta")
          .children("div.hz-product-price")
          .children("del.hz-product-price__list")     
          .text();

      }
      result.link = $(this)
        // .find("a[data-compid='img']")
        .children("div.hz-product-card__image-container")
        .children("a")
        .attr("href");
      result.imglink = $(this)
        .find("img")
        .attr("src");
      console.log(result);

      // Create a new Article using the `result` object built from scraping
      db.Product.create(result)
        .then(function(dbProduct) {
          // View the added result in the console
          console.log(dbProduct);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    //res.send("Scrape Complete");
  });
});


app.get("/products", function(req, res) {
  db.Product.find({})
  .populate("note")
  .then(function(dbProduct) {
    console.log(dbProduct);
    res.json(dbProduct);
  })
  .catch(function(err) {
    // If an error occurs, send it back to the client
    res.json(err);
  });
  
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/products/:id", function(req, res) {
  db.Product.find({
      _id: req.params.id
    })
    // Specify that we want to populate the retrieved libraries with any associated books
    .populate("note")
    .then(function(dbProduct) {
      // If any Libraries are found, send them to the client with any associated Books
      res.json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
});

// Route for saving/updating an Article's associated Note
app.post("/products/:id", function(req, res) {
  console.log(req.body);
  db.Note.create(req.body)
  .then(function(dbNote){
    return db.Product.findOneAndUpdate({_id: req.params.id},{ $push: { note: dbNote._id } }, { new: true });
     
    })
  .then(function(dbProduct){
    res.json(dbProduct);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    return res.json(err);
  });
  
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

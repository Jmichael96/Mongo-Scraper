require('dotenv').config();
const express = require('express');
const app = express();
const exprhbs = require('express-handlebars');
const bodyParser = require('body-parser');
const logger = require("morgan");
const connectDB = require('./services/db');
// scraping tools
const axios = require('axios');
const cheerio = require('cheerio');
// require all models
const db = require("./models");
const PORT = process.env.PORT || 3000;
const htmlRoutes = require('./routes/htmlRoutes/htmlRoutes');
const apiRoutes = require('./routes/apiRoutes/index');

// configure middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// connect to the db
connectDB();

app.use(express.static('public'));
app.engine("handlebars", exprhbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(htmlRoutes);
app.use(apiRoutes);

// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// //displaying all scraped articles to homepage from newest to oldest
// app.get("/", function (req, res) {
//   db.Article.find({}).then(function (dbArticles) {
    // res.render("index", {
    //   articles: dbArticles
    // });
//   })
// });

// // displaying all saved articles from newest to oldest
// app.get("/saved", function (req, res) {
//   db.Saved.find({}).sort({ "id": -1 })
//     // .populate('comment')
//     .exec(function (err, savedData) {
//       if (err) {
//         console.log(err);
//       } else {
//         const hbsObject = { saved: savedData };
//         res.render('saved', hbsObject);
//       }
//     });
// });

// // A route to save articles.
// app.get("/save/:id", function (req, res) {
  // db.Article.findById(req.params.id)
  //   // .populate('comment')
  //   .exec(function (err, articalData) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(articalData);

  //       const savingData = {};

  //       savingData.title = articalData.title;
  //       savingData.summary = articalData.summary;
  //       savingData.link = articalData.link;

  //       console.log(savingData);
  //       db.Saved.create(savingData)
  //         .then(function (confirm) {
  //           console.log(confirm);
  //         })
  //         .catch(function (error) {
  //           console.log(error);
  //         });
  //       res.redirect("/");
  //     }
  //   });
// });
// // clearing all articles on home page
// app.get("/clear", function (req, res) {
//   db.Article.deleteMany({})
//   .then(function(doc){
//     console.log(doc);
//     res.redirect("/");
//   })
// });
// // scrape the article function
// app.get("/scrape", function (req, res) {
//   // request-grab html body from nytimes.com
//   axios.get("https://supercross.com/newsblog/")
//     .then(function (response) {
//       // load html body into cheerio's $ for shorthand selector
//       const $ = cheerio.load(response.data);
//       const result = {};
//       $('article').each(function (i, element) {
//         // add the text and href of every link, and save them as properties of the result object. 
//         result.title = $(this).children("h2").text();
//         result.summary = $(this).children("div").text();
//         result.link = $(this).children("h2").children("a").attr("href");

//         db.Article.create(result)
//           .then(function (dbArticle) {
//             console.log(dbArticle);
//           })
//           .catch(function (err) {
//             return res.json(err);
//           });
//       });
//       res.send("scrape complete :)");
//     });
// });
// // Delete a single article out of the saved page
// app.get("/delete-one/:id", function (req, res) {
//   // Use the article id to find and update its saved boolean
//   db.Saved.findOneAndDelete({ "_id": req.params.id })
//     .then( function(doc){
//       console.log(doc);
//       res.redirect("/saved");
//     });
// });

// // deleting all saved articles
// app.get("/clear-all", function(req, res){
//   db.Saved.deleteMany({})
//   .then(function(doc){
//     console.log(doc);
//     res.redirect("/saved");
//   })
//   console.log('Everything is gone...');
// })
// // Create a new note
// app.post("/note/:id", function (req, res) {
//   // Create a new note and pass the req.body to the entry
//   console.log(req.body.noteId);
//   db.Saved.findOneAndUpdate({ "_id": req.params.id }, { "note": req.body.noteId })
//     .then(function (doc) {
//       console.log(req.params.id);
//       console.log(doc);
//       res.redirect("/saved")
//     })
//     .catch(function (err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });
// // deleting a single note
// app.get("/delete-note/:id", function(req, res){
//   db.Saved.findOneAndUpdate({ "_id": req.params.id }, { "note": "" })
//   .then(function(doc){
//     console.log(req.params.id);
//     console.log(doc);
//     res.redirect("/saved");
//   });
// })
// start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});
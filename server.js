// var express = require('express');
// var exprhbs = require('express-handlebars');
// var bodyParser = require('body-parser');
// var logger = require("morgan");
// var mongoose = require('mongoose');
// var routes = require("./routes");

// // scraping tools
// var axios = require('axios');
// var cheerio = require('cheerio');

// // require all models
// var db = require("./models");

// // initialize express
// var app = express();
// var PORT = process.env.PORT || 3000;

// // configure middleware
// app.use(logger('dev'));

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.use(express.static('public'));

// app.engine("handlebars", exprhbs({defaultLayout: "main"}));
// app.set("view engine", "handlebars");

// app.use(routes);

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoNews"
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// //mongoose.connect("mongodb://localhost/mongoNews");

// // start the server
// app.listen(PORT, function() {
//     console.log("App running on port " + PORT);
// });
var express = require('express');
var exprhbs = require('express-handlebars');
var bodyParser = require('body-parser');
var logger = require("morgan");
var mongoose = require('mongoose');

// scraping tools
var axios = require('axios');
var cheerio = require('cheerio');

// require all models
var db = require("./models");

// initialize express
var app = express();
var PORT = process.env.PORT || 3000;

// configure middleware
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.engine("handlebars", exprhbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
//mongoose.connect("mongodb://localhost/mongoNews");
//GET requests to render Handlebars pages
app.get("/", function (req, res) {
  db.Article.find({}).then(function (dbArticles) {
    res.render('index', {
      articles: dbArticles
    });
  })

});

app.get("/saved", function (req, res) {
  db.Article.find({ "saved": true }).populate("notes").exec(function (error, articles) {
    let hbsObject = {
      article: articles
    };
    res.render("saved", hbsObject);
  });
});

//
app.get("/scrape", function (req, res) {
  // request-grab html body from nytimes.com
  axios.get("https://supercross.com/newsblog/")
    .then(function (response) {
      // load html body into cheerio's $ for shorthand selector
      var $ = cheerio.load(response.data);
      var result = {};
      $('article').each(function (i, element) {
        // add the text and href of every link, and save them as properties of the result object. 
        result.title = $(this).children("h2").text();
        result.summary = $(this).children("div").text();
        result.link = $(this).children("h2").children("a").attr("href");

        db.Article.create(result)
          .then(function (dbArticle) {
            console.log(dbArticle);
          })
          .catch(function (err) {
            return res.json(err);
          });
      });
      res.send("scrape complete :)");
    });
});

app.get("/articles", function (req, res) {
  // Grab every doc in the Articles array
  db.Article.find({}, function (err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// ObjectId is a mongodb field
// app.get("/articles/:id", function (req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ "_id": req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     // now, execute our query
//     .exec(function (err, doc) {
//       // Log any errors
//       if (err) {
//         console.log(err);
//       }
//       // Otherwise, send the doc to the browser as a json object
//       else {
//         res.json(doc);
//       }
//     });
// });

// Save an article
app.post("/api/savedArticles/:id", function (req, res) {
  // Use the article id to find and update its saved boolean
  console.log(req.params.id);
    db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        $set: {
          saved: true
        }
      })
      .then(function (data) {
        res.send('article was saved in the DB');
      })
      .catch(function (err) {
        res.json(err)
      });
});
// Delete an article
app.post("/articles/delete/:id", function (req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
    // Execute the above query
    .exec(function (err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});

// Create a new note
app.post("/notes/save/:id", function (req, res) {
  // Create a new note and pass the request.body to the entry
  let newNote = new Note({
    body: req.body.text,
    article: req.params.id
  });
  console.log(req.body)
  // And save the new note the db
  newNote.save(function (err, note) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's notes
      db.Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": note } })
        // Execute the above query
        .exec(function (err) {
          // Log any errorors
          if (err) {
            console.log(err);
            res.send(err);
          }
          else {
            // Or send the note to the browser
            res.send(note);
          }
        });
    }
  });
});


app.delete("/notes/delete/:note_id/:article_id", function (req, res) {
  // Use the note id to find and delete it
  db.Note.findOneAndRemove({ "_id": req.params.note_id }, function (err) {
    // Log any errors
    if (err) {
      console.log(err);
      response.send(err);
    }
    else {
      db.Article.findOneAndUpdate({ "_id": req.params.article_id }, { $pull: { "notes": req.params.note_id } })
        // Execute the above query
        .exec(function (err) {
          // Log any errors
          if (err) {
            console.log(err);
            res.send(err);
          }
          else {
            // Or send the note to the browser
            res.send("Note Deleted");
          }
        });
    }
  });
});

// start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});
// var db = require('../models');
// var axios = require('axios');
// var cheerio = require('cheerio');

// module.exports = {
//     find: function (req, res) {
//         db.Article.find({})
//             .then(function (dbArticle) {
//                 res.json(dbArticle);
//             })
//             .catch(function (err) {
//                 return res.json(err);
//             })
//     },
//     create: function (req, res) {
//         axios.get("https://supercross.com/newsblog/")
//             .then(function (response) {
//                 // load html body into cheerio's $ for shorthand selector
//                 var $ = cheerio.load(response.data);
//                 var result = {};
//                 $('article').each(function (i, element) {
//                     // add the text and href of every link, and save them as properties of the result object. 
//                     result.title = $(this).children("h2").text();
//                     result.summary = $(this).children("div").text();
//                     result.link = $(this).children("h2").children("a").attr("href");

//                     db.Article.create(result)
//                         .then(function (dbArticle) {
//                             console.log(dbArticle);
//                         })
//                         .catch(function (err) {
//                             return res.json(err);
//                         });
//                 });
//                 res.send("scrape complete :)");
//             });
//     }, findOne: function (req, res) {
//         db.Article.findOne({ _id: req.params.id })
//             .populate('note')
//             .then(function (dbArticle) {
//                 res.json(dbArticle);
//             })
//             .catch(function (err) {
//                 res.json(err);
//             });
//     }, updateOne: function (req, res) {
//         const _id = req.params.id
//         const saved = req.body.saved
//         db.Article.update({
//             saved: req.body.saved
//         }, {
//                 where: {
//                     _id: req.params.id
//                 }
//             })
//         db.Article
//             .update({ _id }, { $set: { saved: saved } })
//             .then(function (dbArticle) {
//                 res.json(dbArticle);
//             });
//     }
// };

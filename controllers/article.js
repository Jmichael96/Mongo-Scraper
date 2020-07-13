const db = require('../models');
const axios = require('axios');
const cheerio = require('cheerio');

// @route GET api/article/
// @desc Fetch all articles
exports.fetchArticles = (req, res, next) => {
    // db.Article.find()
    //     .then((articles) => {
    //         if (articles) {
    //             res.status(201).json({
    //                 articles: articles
    //             });
    //             res.render("index", {
    //                 articles: articles
    //             });
    //         }
    //     })
        // .catch((err) => {
        //     res.status(500).json({
        //         serverMsg: 'Error fetching articles'
        //     });
        // });
}

// @route GET api/article/scrape
// @desc Scrape the given url for data
exports.scrape = (req, res, next) => {
    axios.get('https://supercross.com/newsblog/')
        .then((response) => {
            const $ = cheerio.load(response.data);
            const result = {};
            $('article').each(function (i, element) {
                // add the text and href of every link, and save them as properties of the result object. 
                result.title = $(this).children("h2").text();
                result.summary = $(this).children("div").text();
                result.link = $(this).children("h2").children("a").attr("href");

                db.Article.create(result)
                    // .then(function (dbArticle) {
                    //     res.status(201).json({
                    //         articles: 
                    //     })
                    //     console.log(dbArticle);
                    // })
                    // .catch(function (err) {
                    //     return res.json(err);
                    // });

            });
        });
}

// @route DELETE api/article/clear
// @desc delete all the article data
exports.clear = (req, res, next) => {
    db.Article.deleteMany() 
    .then((dbArticles) => {
        res.redirect('/');
    })
    .catch((err) => {
        res.status(500).json({
            serverMsg: 'Error deleting articles'
        });
    });
}
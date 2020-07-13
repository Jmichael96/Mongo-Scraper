const router = require('express').Router();
const db = require('../../models');

router.get('/', (req, res, next) => {
    db.Article.find()
    .then((articles) => {
        // creating an empty array to push all articles that are not saved
        let arr = [];
        // iterating over articles to find all non-saved articles
        for (let i = 0; i < articles.length; i++) {
            if (articles[i].saved === false) {
                arr.push(articles[i]);
            }
        }
        res.render('index', {
            articles: arr
        });
    })
    .catch((err) => {
        res.status(500).json({
            serverMsg: 'There was a problem with the server.'
        });
        throw err;
    })
});

router.get('/saved', (req, res, next) => {
    db.Article.find().sort({ _id: -1 })
    .then((articles) => {
        // creating empty array for saved articles
        let savedArr = [];
        // iterating over articles to push to empty array
        for (let i = 0; i < articles.length; i++) {
            if (articles[i].saved === true) {
                savedArr.push(articles[i]);
            }
        }
        res.render('saved', {
            savedArticles: savedArr
        });
    })
    .catch((err) => {
        res.status(500).json({
            serverMsg: 'There was a problem with the server.'
        });
        throw err;
    });
});

module.exports = router;
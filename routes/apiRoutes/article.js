const router = require('express').Router();
const db = require('../../models');
const axios = require('axios');
const cheerio = require('cheerio');

// @route GET api/article/scrape
// @desc Scrape the given url for data
router.get('/scrape', (req, res, next) => {
  axios.get('https://www.supercrosslive.com/news')
    .then((response) => {
      const $ = cheerio.load(response.data);
      const result = {};
      $('div.news').each(function (i, element) {
        result.title = $(this).children('div.news-wrapper').children('div.addition-block').children('h2').text();
        result.date = $(this).children('div.news-wrapper').children('div.addition-block').children('div.post-date').text();
        result.image = $(this).children('div.news-wrapper').children('div.background-image').children('a').children('picture').children('img').attr('src');
        result.link = $(this).children('div.news-wrapper').children('div.addition-block').children('div.read-more').children('a').attr('href');

        const article = new db.Article({
          title: result.title,
          image: result.image,
          link: 'https://www.supercrosslive.com' + result.link,
          date: result.date
        });

        article.save();
      });
      res.status(201).json({
        serverMsg: 'Scraped articles successfully'
      });
    })
    .catch((err) => {
      return res.status(500).json({
        serverMsg: 'Server Error'
      });
    })
});

// @route GET api/article/all_articles
// @desc fetch all articles
router.get('/all_articles', (req, res, next) => {
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
      res.status(201).json(arr);
    })
    .catch((err) => {
      res.status(500).json({
        serverMsg: 'Error fetching articles'
      });
    });
});

// @route GET api/article/all_saved
// @desc fetch all saved articles
router.get('/all_saved', (req, res, next) => {
  db.Article.find()
    .then((articles) => {
      // creating an empty array to push all articles that are not saved
      let arr = [];
      // iterating over articles to find all non-saved articles
      for (let i = 0; i < articles.length; i++) {
        if (articles[i].saved === true) {
          arr.push(articles[i]);
        }
      }
      res.status(201).json(arr);
    })
    .catch((err) => {
      res.status(500).json({
        serverMsg: 'Error fetching articles'
      });
    });
});
// @route DELETE api/article/clear
// @desc delete all the article data
router.delete('/clear', (req, res, next) => {
  db.Article.deleteMany()
    .then((dbArticles) => {
      res.status(201).json({
        serverMsg: 'Deleted articles successfully'
      });
    })
    .catch((err) => {
      res.status(500).json({
        serverMsg: 'Error deleting articles'
      });
    });
});

// @route PUT api/article/save/:id
// @desc save an article
router.put('/save/:id', (req, res, next) => {
  db.Article.findByIdAndUpdate({ _id: req.params.id })
    .then((article) => {
      // checking if there is an article and then saving it
      if (article) {
        article.saved = true;
      }
      // saving the article
      article.save();

      res.status(201).json(article);
    })
    .catch((err) => {
      res.status(500).json({
        serverMsg: 'There was an error saving this article. Please try again later.'
      })
      throw err;
    });
});

// @route PUT api/article/unsave/:id
// @desc Unsave an article
router.put('/unsave/:id', (req, res, next) => {
  db.Article.findByIdAndUpdate({ _id: req.params.id })
    .then((article) => {
      // checking if there is an article and then setting saved to false
      if (article) {
        article.saved = false;
      }
      // saving to db
      article.save();

      res.status(201).json(article);
    })
    .catch((err) => {
      res.status(500).json({
        serverMsg: 'There was an error unsaving this article. Please try again later.'
      })
      throw err;
    });
});

// @route PUT api/article/unsave_all
// @desc Unsave all saved articles
router.put('/unsave_all', (req, res, next) => {
  db.Article.find()
    .then((articles) => {
      // iterating over articles and if the parameter of saved is equal to true. Change it to false
      for (let i = 0; i < articles.length; i++) {
        if (articles[i].saved === true) {
          articles[i].saved = false;

          articles[i].save();
        }
      }
      // articles.save();
      res.status(201).json(articles);
    })
    .catch((err) => {
      res.status(500).json({
        serverMsg: 'There was an error unsaving all articles. Please try again later.'
      })
      throw err;
    });
});

// @route PUT api/article/add_comment/:id
// @desc Add a comment for an article
router.post('/add_comment/:id', (req, res, next) => {
  db.Article.findByIdAndUpdate({ _id: req.params.id })
    .then((article) => {
      article.comments.unshift({ comment: req.body.comment });
      article.save();
      console.log(article);
      res.status(201).redirect('/saved');
    })
    .catch((err) => {
      res.status(500).json({
        serverMsg: 'There was an error adding a comment.'
      })
      throw err;
    });
});

// @route PUT api/article/delete_comment/:postId/:commentId
// @desc delete a comment
router.put('/delete_comment/:postId/:commentId', (req, res, next) => {
  db.Article.findByIdAndUpdate({ _id: req.params.postId })
    .then((article) => {
      const comment = article.comments.find((comment) =>
        comment.id === req.params.commentId
      );
      if (!comment) {
        return res.status(404).json({
          serverMsg: 'Comment not found'
        });
      }
      article.comments = article.comments.filter(
        ({ id }) => id !== req.params.commentId
      )
      article.save();
      return res.status(201).json({
        article: article,
        serverMsg: 'Deleted comment'
      });
    })
    .catch((err) => {
      res.status(500).json({
        serverMsg: 'There was an error deleting a comment.'
      })
      throw err;
    });
});

module.exports = router;
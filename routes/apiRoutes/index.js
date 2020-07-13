const router = require('express').Router();
const article = require('./article');

router.use('/api/article', article);

module.exports = router;
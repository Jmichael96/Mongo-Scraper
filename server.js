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

// start the server
app.listen(PORT, function () {
  console.log(`Bears... Beets... Battlestar Galactica on Port ${PORT}`);
});
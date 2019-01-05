// Require mongoose
const mongoose = require("mongoose");

// Create Schema class
const Schema = mongoose.Schema;

// Create article schema
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: {
     type: String,
     required: false
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
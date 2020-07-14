// Require mongoose
const mongoose = require("mongoose");

// Create article schema
const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  image: {
    type: String
  },
  date: {
    type: String
  },
  saved: {
    type: Boolean,
    default: false
  },
  comments: [
    {
     comment: {
       type: String,
     },
     date: {
       type: Date,
       default: Date.now
     }
    },
  ]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
const mongoose = require('mongoose');

const SavedSchema = new mongoose.Schema({
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
  note: [
    {
      type: String,
    },
  ]
});

const Saved = mongoose.model('Saved', SavedSchema);

module.exports = Saved;
const mongoose = require("mongoose");

var Schema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("article", Schema);

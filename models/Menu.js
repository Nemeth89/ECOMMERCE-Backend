const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);

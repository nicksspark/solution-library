const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// Schemas: The outline of how every single document should look
const Schema = mongoose.Schema;

// USER SCHEMA
const userSchema = new Schema({
  fname: String,
  lname: String,
  username: String,
  email: String,
  hashedPassword: String
});

const bookSchema = new Schema({
  title: String,
  author: String,
  date: Date,
  keywords: Array,
  image: String,
  chapters: Object, //each chapter key will have an array of links
  genre: String
});

//  Models: pass the schema as an argument after building schema

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);
module.exports = {
  User,
  Book,
};

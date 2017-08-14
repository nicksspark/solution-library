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
  chapters: Array,
  uploads: [{ type: Schema.Types.ObjectId, ref: 'Upload' }], //each chapter key will have an array of links
  genre: String
});

const uploadSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    date: Date,
    keywords: Array,
    upvotes: Number,
    chapter: String,
    link: String,
    title: String
    // comments:[{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

// const commentSchema = new Schema({
//     author: String,
//     date: Date,
//     likes: Number
// })

//  Models: pass the schema as an argument after building schema

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);
const Upload = mongoose.model('Upload', uploadSchema);
// const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
  User,
  Book,
  Upload,
  // Comment
};

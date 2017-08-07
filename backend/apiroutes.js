const express = require('express');

const router = express.Router();
const models = require('./models/models.js');
// IMPORTING ALL MODELS
const User = models.User;
const Book = models.Book;
// const passport = require('passport');
// hashing
const crypto = require('crypto');
const isEmail = require('is-email');

//S3 STUFF:
// Load the SDK for JavaScript
var AWS = require('aws-sdk');

// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config.json');

// Multer config
const multer = require('multer');
// memory storage keeps file data in a buffer
const upload = multer({
    storage: multer.memoryStorage(),
    // file size limitation in bytes
    limits: { fileSize: 52428800 },
});

function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// ROUTES:

router.post('/register', async (req, res) => {
  const isValidUser = (user) => {
    if (!user.fname) {
      return Promise.reject('Please enter your first name.');
    }
    if (!user.lname) {
      return Promise.reject('Please enter your last name.');
    }
    if (!isEmail(user.email)) {
      return Promise.reject('Please enter a valid email address.');
    }
    if (!user.username) {
      return Promise.reject('Please enter a username.');
    }
    if (!user.hashedPassword) {
      return Promise.reject('Please enter a password.');
    }
    return new Promise((resolve, reject) => {
      User.findOne({ email: user.email }, (err, foundUser) => {
        if (err) {
          return reject(err);
        }
        return resolve(foundUser);
      });
    });
  };


  const validUser = {
    fname: req.body.fname,
    lname: req.body.lname,
    username: req.body.username,
    email: req.body.email,
    hashedPassword: hashPassword(req.body.password)
  };

  try {
    const user = await isValidUser(validUser);

    if (user) {
      res.json({ error: 'email taken' });
      return;
    }
    new User(validUser).save((err, newUser) => {
      if (err) {
        res.json({ failure: 'failed to save new user' });
      } else {
        res.json({ success: 'saved new user' });
        console.log('saved the new user!!');
      }
    });
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
});

// gets the user, gets the user's library
// router.post('/', (req, res) => {
//   const userId = req.body.id;
//     User.findById(userId)
//     .populate('library')
//     .exec((err, user) => {
//       if (err) {
//         res.json({ failure: 'failed to find user' });
//       }
//       console.log(user);
//       res.json({ success: true, books: user.library });
//     });
//   });

router.get('/book/:bookId', (req, res) => {
    console.log('here')
    Book.findById(req.params.bookId, (err, book) => {
        if (err) {
            res.json({ failure: 'error' });
        } else if (!book) {
            res.json({ failure: 'no book'});
        } else {
            res.json({
                success: true,
                book: book
            })
        }
    })
})

router.post('/upload', upload.single('myFile'), (req, res) => {
    // Create S3 service object
    const s3 = new AWS.S3();
    console.log('THE FILE', req.file)
    // call S3 to retrieve upload file to specified bucket
    var params = {
        Bucket: 'cramberry',
        Key: 'theFile',
        Body: req.file.buffer,
        ACL: 'public-read', // your permisions
    };

    // call S3 to retrieve upload file to specified bucket
    s3.upload(params, function (err, data) {
        if (err) {
            console.log("ERROR", err);
        } if (data) {
            console.log("Upload Success", data);

        }
    });

})
router.get('/searchbar', (req,res) => {
    Book.find()
    .exec((err, books) => {
        if (err) {
            res.json({ failure: "cannot find books"})
        }
        const newBook = books.map((book) => {
            return {
                title: book.title,
                author: book.author,
                key: book.id
            }
        });
        res.json({ success: true, books: newBook });
    });
});

router.post('/loadchapters', (req,res) => {
    Book.findById(req.body.bookId)
    .exec((err, books) => {
        if (err) {
            res.json({ failure: "cannot find book"})
        }
        const chapters = Object.keys(books.chapters);
        res.json({ success: true, chapters: chapters });
    });
});

module.exports = router;

const express = require('express');

const router = express.Router();
const models = require('./models/models.js');
// IMPORTING ALL MODELS
const User = models.User;
const Book = models.Book;
const Upload = models.Upload;
// const passport = require('passport');
// hashing
const crypto = require('crypto');
const isEmail = require('is-email');

//pdfstuff
const PdfPrinter = require('pdfmake')

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
    limits: { fileSize: 52428800 * 2 },
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


router.get('/book/:bookId', (req, res) => {
    Book.findById(req.params.bookId).populate('uploads').exec((err, book) => {
        if (err) {
            res.json({ failure: 'error' });
        } else if (!book) {
            res.json({ failure: 'no book'});
        } else {
            const bookArr = [];
            for (let i = 0; i < book.chapters.length; i++) {
                const chapArr = [];
                book.uploads.forEach((upload) => {
                    if (book.chapters[i] === upload.chapter){
                        chapArr.push(upload);
                    }
                });
                bookArr.push(chapArr);
            }
            res.json({
                success: true,
                uploads: bookArr,
                title: book.title,
                author: book.author,
                chapters: book.chapters
            });
        }
    });
});


router.post('/upload', upload.array('myFiles'), (req, res) => {
    if (req.body.fileType === 'application/pdf') {
        const s3 = new AWS.S3();
        // call S3 to retrieve upload file to specified bucket
        var params = {
            Bucket: 'cramberry',
            Key: Math.floor(Math.random() * 10000000000).toString() + '.pdf',
            Body: req.files[0].buffer,
            ContentType: 'application/pdf',
            ACL: 'public-read', // your permissions
        };

        // call S3 to retrieve upload file to specified bucket
        s3.upload(params, function (err, data) {
            if (err) {
                console.log("ERROR", err);
            } else if (data) {
                const title = req.body.title ? req.body.title : 'Untitled';
                new Upload ({
                    user: req.body.user,
                    date: new Date(),
                    keywords: req.body.keyWords,
                    upvotes: 0,
                    chapter: req.body.chapter,
                    link: data.Location,
                    title
                }).save((err, newUpload) => {
                    if (err) {
                        res.json({ failure: 'failed to save new upload' });
                    } else {
                        Book.findById(req.body.searchId, (err, book) => {
                            if (err) {
                                console.log('update err', err);
                            } else if (book) {
                                book.uploads.push(newUpload._id);
                                book.save((err, updatedBook) => {
                                    if (err) {
                                        res.json({failure: 'failed to save the new upload'})
                                    }
                                })
                                console.log('upload success');
                                res.json({success: 'saved new upload'})
                            } else {
                                console.log('no book'); //no err and no book
                            }
                        });
                    }
                });
            }
        });
    } else if (req.body.fileType === 'image/png' || req.body.fileType === 'image/jpg' ||req.body.fileType === 'image/jpeg') {
        let docDefinition = {
            content: []
        };
        req.files.forEach(file => {
            docDefinition.content.push({
                // if you specify width, image will scale proportionally
                image: 'data:' + req.body.fileType + ';base64,' +  file.buffer.toString('base64'),
                width: 520
            });
        });

        const path = require('path');
        const fonts = {
            Roboto: {
                normal: path.join(__dirname, '../public/fonts/Roboto-Regular.ttf'),
                bold: path.join(__dirname, '../public/fonts/Roboto-Medium.ttf'),
                italics: path.join(__dirname, '../public/fonts/Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, '../public/fonts/Roboto-MediumItalic.ttf')
            }
        };

        const printer = new PdfPrinter(fonts);
        var pdfDoc = printer.createPdfKitDocument(docDefinition);

        var chunks = [];
        var result;

        pdfDoc.on('data', function (chunk) {
            chunks.push(chunk);
        });
        pdfDoc.on('end', function () {
            result = Buffer.concat(chunks);

            // Create S3 service object
            const s3 = new AWS.S3();
            // call S3 to retrieve upload file to specified bucket
            var params = {
                Bucket: 'cramberry',
                Key: Math.floor(Math.random() * 10000000000).toString() + '.pdf',
                Body: result,
                ContentType: 'application/pdf',
                ACL: 'public-read', // your permissions
            };

            // call S3 to retrieve upload file to specified bucket
            s3.upload(params, function (err, data) {
                if (err) {
                    console.log("ERROR", err);
                } else if (data) {
                    const title = req.body.title ? req.body.title : 'Untitled';
                    new Upload ({
                        user: req.body.user,
                        date: new Date(),
                        keywords: req.body.keyWords,
                        upvotes: 0,
                        chapter: req.body.chapter,
                        link: data.Location,
                        title,
                    }).save((err, newUpload) => {
                        if (err) {
                            res.json({ failure: 'failed to save new upload' });
                        } else {
                            Book.findById(req.body.searchId, (err, book) => {
                                if (err) {
                                    console.log('update err', err);
                                } else if (book) {
                                    book.uploads.push(newUpload._id);
                                    book.save((err, updatedBook) => {
                                        if (err) {
                                            res.json({failure: 'failed to save the new upload'})
                                        }
                                    })
                                    console.log('upload success');
                                    res.json({success: 'saved new upload'})
                                } else {
                                    console.log('no book'); //no err and no book
                                }
                            });
                        }
                    });
                }
            });
        });
        pdfDoc.end();
    }
});
router.get('/searchbar', (req,res) => {
    Book.find()
    .exec((err, books) => {
        if (err) {
            res.json({ failure: "cannot find books"})
        }
        const newBooks = books.map((book) => {
            return {
                title: book.title,
                author: book.author,
                key: book.id,
                image: book.image,
                genre: book.genre,
            }
        });
        res.json({ success: true, books: newBooks });
    });
});

router.post('/loadchapters', (req,res) => {
    Book.findById(req.body.bookId)
    .exec((err, books) => {
        if (err) {
            res.json({ failure: "cannot find book"})
        };
        res.json({ success: true, chapters: books.chapters });
    });
});

router.post('/like', (req,res) => {
    Upload.findById(req.body.uploadId)
    .exec((err, upload) => {
        if (err) {
            res.json({failure: "cannot find upload"})
        }
        upload.upvotes = req.body.upvotes;
        upload.save((err, updatedUpload) => {
            if (err) {
                res.json({ failure: 'failed to save the like'});
            }
            res.json({ success: true, updatedUpload: updatedUpload});
        });
    })
})


module.exports = router;

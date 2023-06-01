const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      let newUser = { username: username, password: password };
      users.push(newUser);
      return res
        .status(201)
        .json({ message: 'User account created successfully!' });
    } else {
      return res.status(400).json({ message: 'This user already exist!' });
    }
  }
  return res.status(400).json({ message: 'Input fields cannot be empty!' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  const bookList = JSON.stringify(books, null, 4);
  if (bookList.length > 0) {
    return res.status(201).send(bookList);
  } else {
    return res.status(403).json({ message: 'No book found!' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const bookISBN = req.params.isbn;

  if (bookISBN) {
    const filteredISBN = Object.entries(books).filter(
      ([key]) => key == bookISBN
    );

    if (filteredISBN.length > 0) {
      return res.status(201).json(filteredISBN);
    } else {
      return res.status(201).json({
        message: `Book with ISBN: ${bookISBN.toUpperCase()} not found!`,
      });
    }
  } else {
    return res.status(403).json({ message: 'Invalid Request!' });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  if (author) {
    const filteredAuthor = Object.values(books).filter(
      (book) => book.author.toLowerCase() == author.toLowerCase()
    );
    if (filteredAuthor.length > 0) {
      return res.status(201).json(filteredAuthor);
    } else {
      return res.status(201).json({
        message: `There is no author with the name ${author.toUpperCase()} found!`,
      });
    }
  } else {
    return res.status(400).json({ message: 'There has been an error!' });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const bookTitle = req.params.title;
  if (bookTitle) {
    const filteredTitle = Object.values(books).filter(
      (book) => book.title.toLowerCase() === bookTitle.toLowerCase()
    );
    if (filteredTitle.length > 0) {
      return res.status(201).json(filteredTitle);
    } else {
      return res.status(201).json({
        message: `There is no author with the name ${bookTitle.toUpperCase()} found!`,
      });
    }
  } else {
    return res.status(400).json({ message: 'There has been an error!' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const bookISBN = req.params.isbn;
  if (bookISBN) {
    const filteredBook = Object.entries(books).filter(
      ([key]) => key == bookISBN
    );

    if (filteredBook.length > 0) {
      //Checking for the book reviews
      const bookReview = filteredBook.reviews;
      if (bookReview) {
        return res.status(201).json(bookReview);
      } else {
        return res
          .status(201)
          .json({ message: 'This book has no review yet!' });
      }
    } else {
      return res.status(201).json({
        message: `The book with this ISBN: ${bookISBN} is not found!`,
      });
    }
  } else {
    return res.status(400).json({ message: 'There has been an error!' });
  }
});

module.exports.general = public_users;

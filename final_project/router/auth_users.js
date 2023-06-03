const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //check if the username is valid
  const validUser = users.filter(
    (user) => user.username.toLowerCase() == username.toLowerCase()
  );
  if (validUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //checks if username and password match the one we have in records.
  const authUser = users.filter(
    (user) =>
      user.username.toLowerCase() === username.toLowerCase() &&
      user.password === password
  );

  if (authUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Input fields cannot be empty!' });
  }

  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: password }, 'accessSecret', {
        expiresIn: 60 * 60,
      });

      if (accessToken) {
        req.session.authorization = { accessToken, username };
        return res.status(200).json({
          message: 'User logged in successfully!',
        });
      }
    }
  }
  return res.status(208).json({ message: 'Invalid Username or password' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const bookISBN = req.params.isbn;
  const { reviewText } = req.body;
  const username = req.session.authorization.username;
  const filteredReviews = Object.entries(books).filter(
    ([key]) => key === bookISBN
  );
  //Adding to the review object
  const reviewObject = filteredReviews[0][1]['reviews'];
  const usernameExist = Object.keys(reviewObject).filter(
    (key) => key == username
  );

  //Checks if a book with such ISBN exists
  if (filteredReviews.length <= 0) {
    res.status(401).json({
      message: `Book with the ISBN: ${bookISBN.toUpperCase()} not found!`,
    });
  }

  //Checking if the review text is empty
  if (!reviewText) {
    res.status(400).json({ message: 'Review input field cannot be empty!' });
  }

  /* Determining if user already has a review for that 
  particular book and isbn annd updating the review if any*/

  if (usernameExist.length > 0) {
    reviewObject[username].reviewMessage = reviewText;
    return res.status(201).json({
      message: `The review of the book with ISBN: ${bookISBN} has been updated!`,
    });
  }

  //Creating a new review if the user has not yet reviewed the book

  reviewObject[username] = { reviewMessage: reviewText };
  return res.status(201).json({
    message: `A new review for the book with ISBN: ${bookISBN} has been created!`,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

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
      //return res.status(201).json({ message: 'User is authenticated' });
      let accessToken = jwt.sign({ data: password }, 'accessSecret', {
        expiresIn: 60 * 60,
      });

      if (accessToken) {
        req.session.authorization = { accessToken, username };
        return res
          .status(200)
          .json({
            message: 'User logged in successfully!',
            reqAuthor: req.session.authorization,
          });
      }
    }
  }
  return res.status(208).json({ message: 'Invalid Username or password' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

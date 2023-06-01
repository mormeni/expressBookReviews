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
  return res.status(400).json({ message: 'Error logging in' });
  /* if (!username || !password) {
    return res.status(400).json({ message: 'Error logging in' });
  }

  if (username & password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: password }, 'accessSecret', {
        expiresIn: 60 * 60,
      });

      req.session.authorization = { accessToken, username };
      return res.status(200).send('User logged in successfully!');
    } else {
      return res.status(208).json({ message: 'Invalid Username or password' });
    }
  } */
  //return res.status(300).json({ message: 'Yet to be implemented' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if provided username is unique and valid
const isValid = (username)=>{ //returns boolean

  // Filter 'users' array and check if provided user exists
  let existingUsers = users.filter(user => {
    return user.username === username;
  });

  // If the user is in the array already, return false
  if (existingUsers > 0) {
    return false;
  } else {                  // Return true if they are not in the array
    return true;
  }

}

// Check if username and password match the one we have in records.
const authenticatedUser = (username,password)=>{ //returns boolean

  // Filter 'users' array and check if provided username and password exist
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  // If provided username and password exist, return true
  if (validUsers.length > 0) {
    return true;
  } else {                      // Return false if username and password aren't in the array
    return false;
  }
  
}

// Ensure only registered users can login
regd_users.post("/login", (req,res) => {

  // Retrieve username and password from request body
  const username = req.body.username;
  const password = req.body.password;

  // Ensure username is provided
  if (!username) {
    res.status(400).json({ error: "Please provide a valid username!"})
  }

  // Ensure password is provided
  if (!password) {
    res.status(400).json({ error: "Please provide a valid password!"})
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {

    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60*30 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }

    // Notify successful login
    res.status(200).json({ message: "User successfully logged in!"});

  } else { // Notify failed authentication/login
    res.status(401).json({ error: "Login failed! Ensure username and password are correct"})
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

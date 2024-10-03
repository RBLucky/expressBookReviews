const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req,res) => {

  // Retrieve username and password from request body
  let username = req.body.username;
  let password = req.body.password;

  // Ensure username is provided
  if (!username) {
    res.json({ error: "You Must Provide a Username!"});
  }

  // Ensure password is provided
  if (!password) {
    res.json({ error: "You Must Provide a Valid Password!"});
  }

  // Ensure provided username and password are valid
  if (username && password) {
    if (isValid(username)) {
      // If valid, add to existing users
      users.push({ "username": username, "password": password });
      // Notify success
      return res.status(200).json({ message: "User successfully registered! You can now login." });
    } else {
      // Notify failure to register in case of error
      res.status(400).json({ message: "User Already Exists!"});
    }
  }

});


// Get the book list available in the shop
public_users.get('/',function (req, res) {

  // Send response with formatted book data
  try {
    res.send(JSON.stringify(books, null, 4));
  }
  // Show error message in case of error
  catch(err) {
    return res.status(404).json({ message: "Looks like our shelves are empty" });
  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  // Retrieve the isbn parameter from the URL and send the corresponding book details
  try {
    const isbn = req.params.isbn;

    res.send(books[isbn]);
  }
  // Respond with message in case of error
  catch(err) {
    res.status(500).json({ message: "Server Encountered an Error. It's Not You, It's Us"})
  }

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  // Retrieve the author parameter from the URL
  const authorName = req.params.author;

  // Filter the 'books' object and check for books with author in URL parameter
  const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === authorName.toLowerCase());

  // Show the book if found or show error message
  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(404).json({ message: "Haven't Heard of That One..."});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  // Retrieve the author parameter from the URL
  const bookTitle = req.params.title;

  // Filter the 'books' object and check for books with the title in URL parameter
  const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === bookTitle.toLowerCase());

  // Show the book if found or show error message
  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(404).json({ message: "Haven't Heard of That One..."});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
  try {
    // Retrieve isbn parameter from URL
    const isbn = req.params.isbn;

    // Find book with the isbn provided
    let matchingBook = books[isbn];

    // Respond with book reviews object
    res.send(matchingBook.reviews);
  }
  // Handle error response in case of an error
  catch(err) {
    res.status(404).json({ message: "Haven't Heard of That One..."})
  }
});

module.exports.general = public_users;

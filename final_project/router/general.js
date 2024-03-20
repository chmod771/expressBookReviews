const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User registered successfully"});
    } else {
      return res.status(404).json({message: "User already exists"});
    }
  }
  if (username == null || password == null) {
    return res.status(404).json({message: "Please fill out both Username and Password"});
  }
  return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 600);
  });

  promise.then(() => {
    return res.send(JSON.stringify(books, null, 4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(isbn), 600);
  });
  
  promise.then(() => {
    if (books[isbn] != null) {
    res.send(books[isbn]);
    } else {
      return res.status(404).json({message: "No matching books"})
    }
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(books), 600);
  });

  promise.then(() => {
    let filteredBooks = Object.values(books).filter((book) => book.author === author)
    if (filteredBooks != null){
      res.send(filteredBooks)
    } else {
      return res.status(404).json({message: "No matching books"})
    }
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(books), 600);
  });

  promise.then(() => {
    let filteredBooks = Object.values(books).filter((book) => book.title === title)
    if (filteredBooks != null){
      res.send(filteredBooks)
    } else {
      return res.status(404).json({message: "No matching books"})
    }
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn] != null) {
  res.send(books[isbn].reviews)
  } else {
    return res.status(404).json({message: "No matching books"})
  }
});

module.exports.general = public_users;

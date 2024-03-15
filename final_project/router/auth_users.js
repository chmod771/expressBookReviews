const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = "simpleSecret"
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let usernameValid = users.filter((user)=>{
    return user.username === username
  });
  if(usernameValid.length > 0){
    return true;
  } else {
    return false;
  }
}


const authenticatedUser = (password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let passwordmatch = users.filter((user)=>{
    return user.password === password
  });
  if(passwordmatch.length > 0 && isValid){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(401).json({message: "Login failed"});
  }
  if (authenticatedUser(password) && isValid(username)) {
      token = jwt.sign(
      {
        user: username,
        data: password,
      },
      JWT_SECRET,
      {
        expiresIn: 60 * 60,
      }
    )
    res.cookie('jwtToken', token);
    return res.status(200).json({message: "Login successful"});
  }
  return res.status(401).json({message: "Login failed"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const jwtToken = 'jwtToken';
  let token = req.cookies[jwtToken];
  decryptedToken = jwt.verify(token, JWT_SECRET)
  const { user } = decryptedToken;
  const isbn = req.params.isbn;
  const review = req.body.review;
  if (books[isbn] != null) {
    books[isbn].reviews[user] = review;
    return res.status(200).json({message: `Your review for book with ISBN ${isbn} has been posted`})
  } else {
    return res.status(404).json({message: "No matching books"})
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const jwtToken = 'jwtToken';
  let token = req.cookies[jwtToken];
  decryptedToken = jwt.verify(token, JWT_SECRET)
  const { user } = decryptedToken;
  const isbn = req.params.isbn;
  if (books[isbn] != null) {
    if (books[isbn].reviews[user] != null) {
      delete books[isbn].reviews[user];
      return res.status(200).json({message: "Your review has been deleted"})
    } else {
      return res.status(404).json({message: "No matching review"})
    }
  } else {
    return res.status(404).json({message: "No matching books"})
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

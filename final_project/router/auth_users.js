const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Login Error"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 30 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User logged in");
    } else {
      return res.status(208).json({message: "Invalid credentials"});
    }
  });

  regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; 
    const username = req.session.authorization.username; 
    const reviewText = req.query.review; 
  
    if (!isbn) {
        return res.status(400).json({ message: "No ISBN found" });
      }
  
      if (!username) {
          return res.status(401).json({message: "No Username"})
      }
  
      if (!reviewText) {
          return res.status(402).json({message: "Please write your review"})
      }
  
    
    if (books[isbn]) {
   
      if (books[isbn].reviews[username]) {
        
        books[isbn].reviews[username] = reviewText;
      } else {
   
        books[isbn].reviews[username] = reviewText;
      }
      return res.status(200).json({ message: "Review posted successfully" });
    } else {
      return res.status(404).json({ message: "Book with ISBN not found" });
    }
  });
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (!isbn) {
      return res.status(400).json({ message: "No ISBN found" });
    }
  
    if (!username) {
      return res.status(401).json({ message: "No Username" });
    }
  

    if (books[isbn]) {
      
      if (books[isbn].reviews[username]) {
      
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
      } else {
        return res.status(404).json({ message: "Review not found for the given ISBN and user" });
      }
    } else {
      return res.status(404).json({ message: "Book with ISBN not found" });
    }
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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

public_users.post('/register', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User registration successful"});
      } else {
        return res.status(404).json({message: "User already exists"});    
      }
    } 
    return res.status(404).json({message: "Unable to register"});
  });

  //get books
  public_users.get('/', function (req, res) {
    const fetchDataPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books) {
                resolve(books);
            } else {
                reject(new Error('Books not found'));
            }
        }, 1000);
    });

    fetchDataPromise
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.status(500).send('An error occurred');
        });
});

//get books by isbn
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject(new Error("Book not found"));
        }
    });

    getBookByISBN
        .then((book) => {
            res.status(200).json(book);
        })
        .catch((error) => {
            res.status(404).json({ message: error.message });
        });
});

//get books by author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const getBooksByAuthor = new Promise((resolve, reject) => {
        const matchingBooks = [];

        for (const isbn in books) {
            if (books[isbn].author === author) {
                matchingBooks.push(books[isbn]);
            }
        }

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject(new Error("No books found"));
        }
    });

    getBooksByAuthor
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((error) => {
            res.status(404).json({ message: 'An error occurred' });
        });
});


// Get books by title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const getBooksByTitle = new Promise((resolve, reject) => {
        const matchingBooks = [];

        for (const isbn in books) {
            if (books[isbn].title === title) {
                matchingBooks.push(books[isbn]);
            }
        }

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject(new Error("No books found"));
        }
    });

    getBooksByTitle
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((error) => {
            res.status(404).json({ message: error.message });
        });
});

  

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      const book = books[isbn];
  
      if (book.reviews && Object.keys(book.reviews).length > 0) {
        return res.status(200).json(book.reviews);
      } else {
        return res.status(404).json({ message: "No reviews available" });
      }
    } else {
      return res.status(404).json({ message: "No book found" });
    }
  });
  

module.exports.general = public_users;

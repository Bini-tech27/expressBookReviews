const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the user is authenticated
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, "yourSecretKey", { expiresIn: '1h' });

  // Return the token in the response
  return res.status(200).json({ message: "Login successful!", token });});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.body; // Extract review from request body
  const username = req.user.username; // Get username from the token

  // Check if review is provided
  if (!review) {
    return res.status(400).json({ message: "Review is required." });
  }

  // Find the book by ISBN
  const book = books.find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user has already reviewed this book
  const existingReview = book.reviews.find(r => r.username === username);
  if (existingReview) {
    // Update the existing review
    existingReview.review = review;
    return res.status(200).json({ message: "Review updated successfully.", book });
  } else {
    // Add a new review
    book.reviews.push({ username, review });
    return res.status(201).json({ message: "Review added successfully.", book });
  }

});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Get username from the token

  // Find the book by ISBN
  const book = books.find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Filter out the review that matches the username
  const initialReviewCount = book.reviews.length;
  book.reviews = book.reviews.filter(review => review.username !== username);

  // Check if any review was deleted
  if (book.reviews.length < initialReviewCount) {
    return res.status(200).json({ message: "Review deleted successfully.", book });
  } else {
    return res.status(404).json({ message: "No review found from this user for the specified book." });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

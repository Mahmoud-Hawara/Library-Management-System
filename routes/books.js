const express = require("express");
const validate = require("../middlewares/validate");
const {
  createBookValidator,
  updateBookValidator,
  deleteBookValidator,
  searchBookValidator,
} = require("../validators/booksValidator");

const {
  getBooks,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/booksController");

const router = express.Router();

// List all books
router.get("/", getBooks);

// Add a new book
router.post("/", createBookValidator, validate, createBook);

// Search books
router.get("/search", searchBookValidator, validate, searchBooks);

// Update or remove a book
router
  .put("/:id", updateBookValidator, validate, updateBook)
  .delete("/:id", deleteBookValidator, validate, deleteBook);

module.exports = router;

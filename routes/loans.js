const express = require("express");
const validate = require("../middlewares/validate");
const {
  checkoutValidator,
  returnValidator,
  getBorrowerLoansValidator,
  getCurrentlyBorrowedBookValidator,
} = require("../validators/loansValidator");

const {
  checkoutBook,
  returnBook,
  getBorrowerLoans,
  getOverdueBooks,
  getCurrentlyBorrowedBook, 
  getLastMonthOverdue, 
  getLastMonthBorrows
} = require("../controllers/loansController");

const router = express.Router();

// List all active loans for a borrower
router.get(
  "/borrower/:borrowerId",
  getBorrowerLoansValidator,
  validate,
  getBorrowerLoans
);

// List all overdue books
router.get("/overdue", getOverdueBooks);

// List current borrowers of a specific book
router.get(
  "/bookId/:bookId",
  getCurrentlyBorrowedBookValidator,
  validate,
  getCurrentlyBorrowedBook
);

// Checkout a book
router.post("/checkout", checkoutValidator, validate, checkoutBook);

// Return a book
router.post("/return", returnValidator, validate, returnBook);

module.exports = router;

///////////////////////////////////////////////////////
//////////////////// BONUS ////////////////////////////
///////////////////////////////////////////////////////

// List overdue borrows of last month
router.get("/overdue-last-month", getLastMonthOverdue);

// List all borrows of last month
router.get("/borrows-last-month", getLastMonthBorrows);

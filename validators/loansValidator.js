const { body, param } = require("express-validator");

exports.getBorrowerLoansValidator = [
  param("borrowerId").isInt().withMessage("Borrower ID must be an integer"),
];

exports.getCurrentlyBorrowedBookValidator = [
    param("bookId").isInt({ min: 1 }).withMessage("Book ID must be a positive integer"),
];

exports.checkoutValidator = [
  body("borrowerId").isInt().withMessage("Borrower ID must be an integer"),
  body("bookId").isInt().withMessage("Book ID must be an integer"),
  body("dueDate").isISO8601().withMessage("Due date must be a valid date"),
];

exports.returnValidator = [
  body("borrowerId").isInt().withMessage("Borrower ID must be an integer"),
  body("bookId").isInt().withMessage("Book ID must be an integer"),
];

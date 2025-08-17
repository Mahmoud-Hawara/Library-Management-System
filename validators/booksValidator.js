const { body, param, query } = require("express-validator");

exports.searchBookValidator = [
  query().custom((value, { req }) => {
    const { title, author, ISBN } = req.query;
    if (!title && !author && !ISBN) {
      throw new Error("Please provide at least one search parameter (title, author, or ISBN)");
    }
    return true;
  }),
  query("title").optional().isString().withMessage("Title must be a string"),
  query("author").optional().isString().withMessage("Author must be a string"),
  query("ISBN").optional().isString().withMessage("ISBN must be a string"),
];

exports.createBookValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("ISBN").notEmpty().withMessage("ISBN is required"),
  body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a positive integer"),
  body("shelf").optional().isString().withMessage("Shelf must be a string"),
];

exports.updateBookValidator = [
  param("id").isInt().withMessage("Book ID must be an integer"),
  body("title").optional().isString().withMessage("Title must be a string"),
  body("author").optional().isString().withMessage("Author must be a string"),
  body("ISBN").optional().isString().withMessage("ISBN must be a string"),
  body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be a positive integer"),
  body("shelf").optional().isString().withMessage("Shelf must be a string"),
];

exports.deleteBookValidator = [
  param("id").isInt().withMessage("Book ID must be an integer"),
];


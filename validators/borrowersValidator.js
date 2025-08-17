const { body, param } = require("express-validator");

exports.createBorrowerValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("registeredDate").optional().isISO8601().withMessage("Registered date must be a valid date"),
];

exports.updateBorrowerValidator = [
  param("id").isInt().withMessage("Borrower ID must be an integer"),
  body("name").optional().isString().withMessage("Name must be a string"),
  body("email").optional().isEmail().withMessage("Valid email required"),
  body("registeredDate").optional().isISO8601().withMessage("Registered date must be a valid date"),
];

exports.deleteBorrowerValidator = [
  param("id").isInt().withMessage("Borrower ID must be an integer"),
];

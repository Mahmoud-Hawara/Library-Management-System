const express = require("express");
const validate = require("../middlewares/validate");
const {
  createBorrowerValidator,
  updateBorrowerValidator,
  deleteBorrowerValidator,
} = require("../validators/borrowersValidator");

const {
  getBorrowers,
  createBorrower,
  updateBorrower,
  deleteBorrower,
} = require("../controllers/borrowersController");

const router = express.Router();

// List all borrowers
router.get("/", getBorrowers);

// Add a new borrower
router.post("/", createBorrowerValidator, validate, createBorrower);

// Update or remove a borrower
router
  .put("/:id", updateBorrowerValidator, validate, updateBorrower)
  .delete("/:id", deleteBorrowerValidator, validate, deleteBorrower);

module.exports = router;

const pool = require('../db');
const asyncWrapper = require('../utils/asyncWrapper');

// List all borrowers
exports.getBorrowers = asyncWrapper(async (req, res) => {
  const [borrowers] = await pool.query("SELECT * FROM borrowers");

  // If no borrowers exist
  if (borrowers.length === 0) {
    return res.json({ message: "No borrowers found", data: [] });
  }

  res.json({ message: "Borrowers fetched successfully", data: borrowers });
});

// Create a borrower
exports.createBorrower = asyncWrapper(async (req, res) => {
  const { name, email, registeredDate } = req.body;

  // Check if email already exists
  const [exists] = await pool.query("SELECT * FROM borrowers WHERE email = ?", [email]);
  if (exists.length > 0) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Insert new borrower
  const [result] = await pool.query(
    "INSERT INTO borrowers (name, email, registeredDate) VALUES (?, ?, ?)",
    [name, email, registeredDate || new Date().toISOString()] // Default to current date
  );

  // Fetch the newly created borrower
  const [[newBorrower]] = await pool.query("SELECT * FROM borrowers WHERE id = ?", [result.insertId]);

  res.status(201).json({ message: "Borrower created successfully", borrower: newBorrower });
});

// Update a borrower
exports.updateBorrower = asyncWrapper(async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, registeredDate } = req.body;

  // Check if borrower exists
  const [borrowers] = await pool.query("SELECT * FROM borrowers WHERE id = ?", [id]);
  if (borrowers.length === 0) return res.status(404).json({ error: "Borrower not found" });

  // Update only provided fields
  await pool.query(
    "UPDATE borrowers SET name = ?, email = ?, registeredDate = ? WHERE id = ?",
    [
      name !== undefined ? name : borrowers[0].name,
      email !== undefined ? email : borrowers[0].email,
      registeredDate !== undefined ? registeredDate : borrowers[0].registeredDate,
      id
    ]
  );

  const [[updatedBorrower]] = await pool.query("SELECT * FROM borrowers WHERE id = ?", [id]);

  res.json({ message: "Borrower updated successfully", borrower: updatedBorrower });
});

// Delete a borrower
exports.deleteBorrower = asyncWrapper(async (req, res) => {
  const id = parseInt(req.params.id);

  // Check if borrower exists
  const [borrowers] = await pool.query("SELECT * FROM borrowers WHERE id = ?", [id]);
  if (borrowers.length === 0) return res.status(404).json({ error: "Borrower not found" });

  // Delete borrower
  await pool.query("DELETE FROM borrowers WHERE id = ?", [id]);

  res.json({ message: "Borrower deleted successfully", borrower: borrowers[0] });
});

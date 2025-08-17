const pool = require("../db");
const asyncWrapper = require("../utils/asyncWrapper");

// Get borrower's active loans
exports.getBorrowerLoans = asyncWrapper(async (req, res) => {
  const { borrowerId } = req.params;

  // Active loans for borrower
  const [activeLoans] = await pool.query(
    `SELECT l.id, l.borrowerId, b.id AS bookId, b.title, b.author, b.ISBN, l.checkOutDate, l.dueDate
     FROM loans l 
     JOIN books b ON l.bookId = b.id 
     WHERE l.borrowerId = ? AND l.returnedDate IS NULL`,
    [borrowerId]
  );

  if (activeLoans.length === 0) return res.json({ message: "No active loans for this borrower", data: [] });

  res.json({ message: "Active loans fetched", data: activeLoans });
});

// List overdue books
exports.getOverdueBooks = asyncWrapper(async (req, res) => {
  const today = new Date().toISOString();

  // Loans past due date
  const [overdue] = await pool.query(
    `SELECT l.*, b.title, br.name,  l.checkoutDate, l.dueDate
     FROM loans l 
     JOIN books b ON l.bookId = b.id 
     JOIN borrowers br ON l.borrowerId = br.id
     WHERE l.returnedDate IS NULL AND l.dueDate < ?`,
    [today]
  );

  if (overdue.length === 0) return res.json({ message: "No overdue books", data: [] });

  res.json({ message: "Overdue books fetched", data: overdue });
});

// Currently borrowed book
exports.getCurrentlyBorrowedBook = asyncWrapper(async (req, res) => {
  const { bookId } = req.params;

  const [rows] = await pool.query(`
    SELECT 
      b.id AS bookId,
      b.title,
      b.ISBN,
      GROUP_CONCAT(br.name SEPARATOR ', ') AS borrowers
    FROM books b
    LEFT JOIN loans l ON l.bookId = b.id AND l.returnedDate IS NULL
    LEFT JOIN borrowers br ON br.id = l.borrowerId
    WHERE b.id = ?
    GROUP BY b.id
  `, [bookId]);

  if (rows.length === 0) return res.status(404).json({ message: "Book not found" });

  res.json({ message: "Currently borrowed book fetched", data: rows[0] });
});

// Checkout a book
exports.checkoutBook = asyncWrapper(async (req, res) => {
  const { borrowerId, bookId, dueDate } = req.body;

  // Check borrower
  const [[borrower]] = await pool.query("SELECT * FROM borrowers WHERE id = ?", [borrowerId]);
  if (!borrower) return res.status(404).json({ error: "Borrower not found" });

  // Check book
  const [[book]] = await pool.query("SELECT * FROM books WHERE id = ? AND quantity > 0", [bookId]);
  if (!book) return res.status(404).json({ error: "Book not found" });

  // Already borrowed?
  const [[existingLoan]] = await pool.query(
    "SELECT * FROM loans WHERE bookId = ? AND borrowerId = ? AND returnedDate IS NULL",
    [bookId, borrowerId]
  );
  if (existingLoan) return res.status(400).json({ error: "Book is already checked out" });

  // Insert loan
  const [result] = await pool.query(
    "INSERT INTO loans (borrowerId, bookId, dueDate) VALUES (?, ?, ?)",
    [borrowerId, bookId, dueDate]
  );

  // Update book quantity
  await pool.query("UPDATE books SET quantity = quantity - 1 WHERE id = ?", [bookId]);

  res.status(201).json({ message: "Book checked out successfully", loanId: result.insertId });
});

// Return a book
exports.returnBook = asyncWrapper(async (req, res) => {
  const { borrowerId, bookId } = req.body;

  // Find active loan
  const [[loan]] = await pool.query(
    "SELECT * FROM loans WHERE borrowerId = ? AND bookId = ? AND returnedDate IS NULL",
    [borrowerId, bookId]
  );

  if (!loan) return res.status(404).json({ error: "Active loan not found" });

  const today = new Date().toISOString();

  // Mark returned
  await pool.query("UPDATE loans SET returnedDate = ? WHERE id = ?", [today, loan.id]);
  await pool.query("UPDATE books SET quantity = quantity + 1 WHERE id = ?", [bookId]);

  res.json({ message: "Book returned successfully", loanId: loan.id });
});

///////////////////////////////////////////////////////
//////////////////// BONUS ////////////////////////////
///////////////////////////////////////////////////////

// Get last month's overdue borrows
exports.getLastMonthOverdue = asyncWrapper(async (req, res) => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [rows] = await pool.query(
    `SELECT l.*, b.title, br.name, l.checkoutDate, l.dueDate
     FROM loans l
     JOIN books b ON l.bookId = b.id
     JOIN borrowers br ON l.borrowerId = br.id
     WHERE l.returnedDate IS NULL AND l.dueDate BETWEEN ? AND ?`,
    [thirtyDaysAgo.toISOString(), today.toISOString()]
  );

  if (rows.length === 0)
    return res.json({ message: "No overdue borrows in the last Month", data: [] });

  res.json({ message: "Overdue borrows fetched for the last Month", data: rows });
});

// Get all borrows of last month based on checkoutDate
exports.getLastMonthBorrows = asyncWrapper(async (req, res) => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [rows] = await pool.query(
    `SELECT l.*, b.title, br.name, l.checkoutDate, l.dueDate, l.returnedDate
     FROM loans l
     JOIN books b ON l.bookId = b.id
     JOIN borrowers br ON l.borrowerId = br.id
     WHERE l.checkoutDate >= ? AND l.checkoutDate <= ?`,
    [thirtyDaysAgo.toISOString(), today.toISOString()]
  );

  if (rows.length === 0)
    return res.json({ message: "No borrows in the last Month", data: [] });

  res.json({ message: "Borrows fetched for the last Month", data: rows });
});

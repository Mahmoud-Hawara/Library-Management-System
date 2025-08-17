const pool = require('../db');
const asyncWrapper = require('../utils/asyncWrapper');

// Get all books
exports.getBooks = asyncWrapper(async (req, res) => {
  const [books] = await pool.query("SELECT * FROM books");

  // If no books in the database
  if (books.length === 0) {
    return res.json({ message: "No books found", data: [] });
  }

  res.json({ message: "Books fetched successfully", data: books });
});

// Search books by title, author, or ISBN
exports.searchBooks = asyncWrapper(async (req, res) => {
  const { title, author, ISBN } = req.query;

  let query = "SELECT * FROM books WHERE 1=1"; // Base query
  const params = [];

  if (title) {
    query += " AND LOWER(title) = ?";
    params.push(title.toLowerCase());
  }

  if (author) {
    query += " AND LOWER(author) = ?";
    params.push(author.toLowerCase());
  }

  if (ISBN) {
    query += " AND ISBN = ?";
    params.push(ISBN);
  }

  const [results] = await pool.query(query, params);

  if (results.length === 0) {
    return res.json({ message: "No matching books found", data: [] });
  }

  res.json({ message: "Books fetched successfully", data: results });
});

// Create a new book
exports.createBook = asyncWrapper(async (req, res) => {
  const { title, author, ISBN, quantity, shelf } = req.body;

  const [result] = await pool.query(
    "INSERT INTO books (title, author, ISBN, quantity, shelf) VALUES (?, ?, ?, ?, ?)",
    [title, author, ISBN, quantity, shelf || "Unknown"] // Default shelf if not provided
  );

  // Fetch the newly created book
  const [[newBook]] = await pool.query("SELECT * FROM books WHERE id = ?", [result.insertId]);

  res.status(201).json({ message: "Book created successfully", book: newBook });
});

// Update a book
exports.updateBook = asyncWrapper(async (req, res) => {
  const id = parseInt(req.params.id);

  // Check if book exists
  const [books] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);
  if (books.length === 0) return res.status(404).json({ error: "Book not found" });

  const { title, author, ISBN, quantity, shelf } = req.body;

  // Update only provided fields
  await pool.query(
    "UPDATE books SET title = ?, author = ?, ISBN = ?, quantity = ?, shelf = ? WHERE id = ?",
    [
      title !== undefined ? title : books[0].title,
      author !== undefined ? author : books[0].author,
      ISBN !== undefined ? ISBN : books[0].ISBN,
      quantity !== undefined ? quantity : books[0].quantity,
      shelf !== undefined ? shelf : books[0].shelf,
      id
    ]
  );

  const [[updatedBook]] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

  res.json({ message: "Book updated successfully", book: updatedBook });
});

// Delete a book
exports.deleteBook = asyncWrapper(async (req, res) => {
  const id = parseInt(req.params.id);

  // Check if book exists
  const [books] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);
  if (books.length === 0) return res.status(404).json({ error: "Book not found" });

  await pool.query("DELETE FROM books WHERE id = ?", [id]);

  res.json({ message: "Book deleted", book: books[0] });
});

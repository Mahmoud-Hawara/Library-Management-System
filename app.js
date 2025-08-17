require('dotenv').config();

const express = require('express');

const booksRouter = require('./routes/books');
const borrowersRouter = require('./routes/borrowers');
const loans = require("./routes/loans");

const basicAuth = require('./middlewares/basicAuth');
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Basic authentication middleware
app.use(basicAuth); 

app.use(express.json());

app.get("/", (req, res) => res.send("📚 Welcome to the Library Management System"));

// Use routers
app.use("/books", booksRouter);
app.use("/borrowers", borrowersRouter);
app.use("/loans", loans);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server listening on :${PORT}`));

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 17, 2025 at 08:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library-management-system`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `ISBN` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `shelf` varchar(50) DEFAULT 'Unknown'
) ;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `ISBN`, `quantity`, `shelf`) VALUES
(14, 'Clean Code', 'Robert C. Martin', '9780132350884', 55, 'A1'),
(15, 'The Pragmatic Programmer', 'Andrew Hunt', '9780201616224', 3, 'A2'),
(16, 'Design Patterns', 'Erich Gamma', '9780201633610', 4, 'B1'),
(17, 'Refactoring', 'Martin Fowler', '9780201485677', 2, 'B2'),
(18, 'Domain-Driven Design', 'Eric Evans', '9780321125217', 6, 'C1'),
(19, 'You Don’t Know JS', 'Kyle Simpson', '9781491904244', 5, 'C2'),
(20, 'Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848', 3, 'D1'),
(21, 'JavaScript: The Good Parts', 'Douglas Crockford', '9780596517748', 4, 'D2'),
(22, 'Effective Java', 'Joshua Bloch', '9780134685991', 2, 'E1'),
(23, 'Cracking the Coding Interview', 'Gayle Laakmann McDowell', '9780984782857', 7, 'E2'),
(25, 'Domain-Driven Design', 'Eric Evans', '1000000000000', 2, 'Unknown');

-- --------------------------------------------------------

--
-- Table structure for table `borrowers`
--

CREATE TABLE `borrowers` (
  `id` int(11) NOT NULL,
  `NAME` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `registeredDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrowers`
--

INSERT INTO `borrowers` (`id`, `NAME`, `email`, `registeredDate`) VALUES
(2, 'Mahmoud Hawara', 'mahmoud115@gmail.com', '2025-08-16'),
(3, 'Charlie Brown', 'charlie@example.com', '2025-03-15'),
(4, 'Diana Prince', 'diana@example.com', '2025-04-20'),
(5, 'Ethan Hunt', 'ethan@example.com', '2025-05-05'),
(6, 'Fiona Gallagher', 'fiona@example.com', '2025-06-18'),
(7, 'George Martin', 'george@example.com', '2025-07-25'),
(8, 'Hannah Baker', 'hannah@example.com', '2025-08-01'),
(9, 'Ian Fleming', 'ian@example.com', '2025-08-10'),
(10, 'Julia Roberts', 'julia@example.com', '2025-08-15'),
(11, 'Walid Hawara', 'walidhawara@gmail.com', '2025-08-17');

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `id` int(11) NOT NULL,
  `borrowerId` int(11) NOT NULL,
  `bookId` int(11) NOT NULL,
  `checkoutDate` date NOT NULL DEFAULT current_timestamp(),
  `dueDate` date NOT NULL,
  `returnedDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loans`
--

INSERT INTO `loans` (`id`, `borrowerId`, `bookId`, `checkoutDate`, `dueDate`, `returnedDate`) VALUES
(1, 3, 14, '2025-08-17', '2025-08-30', '2025-08-17'),
(2, 3, 14, '2025-08-17', '2025-08-30', NULL),
(3, 2, 14, '2025-08-17', '2025-08-30', NULL),
(4, 5, 14, '2025-08-17', '2025-08-30', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `isbn` (`ISBN`),
  ADD UNIQUE KEY `idx_books_isbn` (`ISBN`),
  ADD KEY `ISBN_2` (`ISBN`);

--
-- Indexes for table `borrowers`
--
ALTER TABLE `borrowers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `idx_borrowers_email` (`email`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `borrowerId` (`borrowerId`),
  ADD KEY `bookId` (`bookId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `borrowers`
--
ALTER TABLE `borrowers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`borrowerId`) REFERENCES `borrowers` (`id`),
  ADD CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

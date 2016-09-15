-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 15, 2016 at 08:45 AM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mychatapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(22) NOT NULL,
  `name` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `online` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `email`, `online`) VALUES
(28, 'Trần Vương Minh', '$2a$10$PVf4xVaYFgBDPsKRYnIbseSgKTnfFz4ocDx9JnycOaMTolIgsoPcu', 'vuongminh8181@gmail.com', ''),
(29, 'Minh Trần', '$2a$10$PVf4xVaYFgBDPsKRYnIbse7U7BI0NZ0.kfgkElVYiEiBjE6aak/bi', 'vuongminh8195@gmail.com', ''),
(30, 'illusory blaze', '$2a$10$PVf4xVaYFgBDPsKRYnIbseQcnf3F6dqCsF8OqPpQfYBHdWlXfIN/2', 'ibz@mail.com', ''),
(31, 'Acc01', '$2a$10$PVf4xVaYFgBDPsKRYnIbsel9aL0F4XwSU5EMmqCzsng/eG3bX8cR6', 'acc01@mail.com', ''),
(32, 'acc02', '$2a$10$PVf4xVaYFgBDPsKRYnIbsepDHQAl/IjQUeZL4Ab2OtQMjcS4azqhO', 'acc02@mail.com', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(22) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

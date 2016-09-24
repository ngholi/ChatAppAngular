-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 22, 2016 at 08:09 AM
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
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` int(22) NOT NULL,
  `name` varchar(200) NOT NULL,
  `owner` int(22) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `name`, `owner`) VALUES
(19, 'Room 1', 34),
(20, 'room 2 for acc02', 35),
(21, 'abc', 35),
(22, 'Acc04 room', 37),
(23, 'acc01 another room', 34),
(24, 'ssw', 37),
(25, 'abcd', 37),
(26, 'wqweqr', 37),
(27, 'kwer', 34);

-- --------------------------------------------------------

--
-- Table structure for table `room_user`
--

CREATE TABLE `room_user` (
  `id` int(22) NOT NULL,
  `room_id` int(22) NOT NULL,
  `user_id` int(22) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `room_user`
--

INSERT INTO `room_user` (`id`, `room_id`, `user_id`) VALUES
(1, 19, 34),
(2, 20, 35),
(3, 21, 35),
(4, 22, 37),
(5, 23, 34),
(6, 24, 37),
(7, 25, 37),
(8, 26, 37),
(9, 27, 34),
(11, 22, 34),
(12, 19, 35),
(13, 19, 36),
(14, 25, 34);

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
(34, 'acc01', '$2a$10$PVf4xVaYFgBDPsKRYnIbsel9aL0F4XwSU5EMmqCzsng/eG3bX8cR6', 'acc01@mail.com', ''),
(35, 'acc02', '$2a$10$PVf4xVaYFgBDPsKRYnIbsepDHQAl/IjQUeZL4Ab2OtQMjcS4azqhO', 'acc02@mail.com', ''),
(36, 'acc03', '$2a$10$PVf4xVaYFgBDPsKRYnIbseE3hjqjO0rhAdpQZiW6EeWvdxYrPAHKu', 'acc03@mail.com', ''),
(37, 'acc04', '$2a$10$PVf4xVaYFgBDPsKRYnIbsetH53h89wIi3lXUrC5sYcVvGgSez9.7i', 'acc04@mail.com', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `owner` (`owner`);

--
-- Indexes for table `room_user`
--
ALTER TABLE `room_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id_2` (`room_id`),
  ADD KEY `user_id_2` (`user_id`);

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
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` int(22) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `room_user`
--
ALTER TABLE `room_user`
  MODIFY `id` int(22) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(22) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `fk_room_owner` FOREIGN KEY (`owner`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `room_user`
--
ALTER TABLE `room_user`
  ADD CONSTRAINT `fk_room_user_to_room` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_room_user_to_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

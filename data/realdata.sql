-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 03, 2013 at 12:31 PM
-- Server version: 5.5.25
-- PHP Version: 5.4.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `whosup`
--

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=101 ;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `date_start`, `date_end`, `title`, `description`, `created`, `modified`) VALUES
(1, NULL, NULL, 'skitur', 'et magnis dis parturient montes, nascetur ridiculus mus. Aenean eget magna. Suspendisse tristique neque venenatis', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subtransactions`
--

CREATE TABLE `subtransactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` int(11) DEFAULT NULL,
  `accepted` tinyint(1) DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `payer_id` int(11) DEFAULT NULL,
  `borrower_id` int(11) DEFAULT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `subtransactions`
--

INSERT INTO `subtransactions` (`id`, `amount`, `accepted`, `created`, `modified`, `payer_id`, `borrower_id`, `transaction_id`) VALUES
(1, 50, 1, NULL, NULL, 4, 1, 1),
(2, 50, 1, NULL, NULL, 4, 2, 1),
(3, 50, 1, NULL, NULL, 2, 1, 2),
(4, 50, 1, NULL, NULL, 2, 4, 2),
(5, 50, 1, NULL, NULL, 2, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `total_amount` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `title`, `description`, `total_amount`, `date`, `created`, `modified`, `created_by`, `group_id`) VALUES
(1, 'Pizza', 'pizza', 150, NULL, NULL, NULL, 2, 1),
(2, 'øl', 'øl', 100, NULL, NULL, NULL, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `created`, `modified`) VALUES
(1, 'søren@gmail.com', 'Søren', 'Louv', NULL, NULL),
(2, 'visti@gmail.com', 'Visti', 'Kløft', NULL, NULL),
(3, 'Mikkel@gmail.com', 'Mikkel', 'Fab', NULL, NULL),
(4, 'lasse@gmail.com', 'Lasse', 'Boi', NULL, NULL);

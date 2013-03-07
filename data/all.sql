-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 03, 2013 at 08:19 AM
-- Server version: 5.5.29
-- PHP Version: 5.3.10-1ubuntu3.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `whosup`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `balances`
--
CREATE TABLE IF NOT EXISTS `balances` (
`payer_id` int(11)
,`borrower_id` int(11)
,`balance` decimal(55,0)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `balance_from`
--
CREATE TABLE IF NOT EXISTS `balance_from` (
`payer_id` int(11)
,`borrower_id` int(11)
,`balance` decimal(32,0)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `balance_to`
--
CREATE TABLE IF NOT EXISTS `balance_to` (
`payer_id` int(11)
,`borrower_id` int(11)
,`balance` decimal(33,0)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `balance_union`
--
CREATE TABLE IF NOT EXISTS `balance_union` (
`payer_id` int(11)
,`borrower_id` int(11)
,`balance` decimal(33,0)
);
-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
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
-- Table structure for table `groups_users`
--

CREATE TABLE IF NOT EXISTS `groups_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accepted` tinyint(1) DEFAULT '0',
  `group_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `groups_users`
--

INSERT INTO `groups_users` (`id`, `accepted`, `group_id`, `user_id`, `created`, `modified`) VALUES
(1, 0, 1, 1060831121, NULL, NULL),
(2, 0, 1, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Stand-in structure for view `group_balances`
--
CREATE TABLE IF NOT EXISTS `group_balances` (
`balance` decimal(33,0)
,`group_id` int(11)
,`user_id` int(11)
);
-- --------------------------------------------------------

--
-- Table structure for table `subtransactions`
--

CREATE TABLE IF NOT EXISTS `subtransactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` int(11) DEFAULT NULL,
  `accepted` tinyint(1) DEFAULT '0',
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `payer_id` int(11) DEFAULT NULL,
  `borrower_id` int(11) DEFAULT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `subtransactions`
--

INSERT INTO `subtransactions` (`id`, `amount`, `accepted`, `created`, `modified`, `payer_id`, `borrower_id`, `transaction_id`) VALUES
(1, 50, 1, NULL, NULL, 4, 1, 1),
(2, 50, 1, NULL, NULL, 4, 2, 1),
(3, 50, 1, NULL, NULL, 2, 1, 2),
(4, 50, 1, NULL, NULL, 2, 4, 2),
(5, 50, 1, NULL, NULL, 2, 3, 2),
(6, 50, 1, '2013-03-03 06:38:45', '2013-03-03 06:38:45', 1060831121, 1060831121, 20),
(7, 50, 1, '2013-03-03 06:38:45', '2013-03-03 06:38:45', 1060831121, 1, 20),
(8, 100, 1, '2013-03-03 06:38:45', '2013-03-03 06:38:45', 1060831121, 1060831121, 20),
(9, 30, 1, '2013-03-03 07:16:10', '2013-03-03 07:16:10', 1060831121, 1060831121, 21),
(10, 70, 1, '2013-03-03 07:16:10', '2013-03-03 07:16:10', 1060831121, 1, 21),
(11, 100, 1, '2013-03-03 07:16:10', '2013-03-03 07:16:10', 1060831121, 1060831121, 21);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE IF NOT EXISTS `transactions` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `title`, `description`, `total_amount`, `date`, `created`, `modified`, `created_by`, `group_id`) VALUES
(1, 'Pizza', 'pizza', 150, NULL, NULL, NULL, 2, 1),
(2, 'øl', 'øl', 100, NULL, NULL, NULL, 4, 1),
(19, 'Testing', NULL, 1234, NULL, '2013-03-03 04:24:15', '2013-03-03 04:24:15', NULL, NULL),
(20, 'Diller', NULL, 100, NULL, '2013-03-03 06:38:45', '2013-03-03 06:38:45', NULL, 1),
(21, 'Pensia', NULL, 100, NULL, '2013-03-03 07:16:10', '2013-03-03 07:16:10', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1060831122 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `created`, `modified`) VALUES
(1, 'søren@gmail.com', 'Søren', 'Louv', NULL, NULL),
(2, 'visti@gmail.com', 'Visti', 'Kløft', NULL, NULL),
(3, 'Mikkel@gmail.com', 'Mikkel', 'Fab', NULL, NULL),
(4, 'lasse@gmail.com', 'Lasse', 'Boi', NULL, NULL),
(1060831121, 'la@laander.com', 'Lasse', 'Andersen', '2013-03-03 06:15:38', '2013-03-03 07:58:50');

-- --------------------------------------------------------

--
-- Structure for view `balances`
--
DROP TABLE IF EXISTS `balances`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `balances` AS select `balance_union`.`payer_id` AS `payer_id`,`balance_union`.`borrower_id` AS `borrower_id`,sum(`balance_union`.`balance`) AS `balance` from `balance_union` group by `balance_union`.`payer_id`,`balance_union`.`borrower_id`;

-- --------------------------------------------------------

--
-- Structure for view `balance_from`
--
DROP TABLE IF EXISTS `balance_from`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `balance_from` AS select `a`.`payer_id` AS `payer_id`,`a`.`borrower_id` AS `borrower_id`,sum(`a`.`amount`) AS `balance` from `subtransactions` `a` group by `a`.`payer_id`,`a`.`borrower_id`;

-- --------------------------------------------------------

--
-- Structure for view `balance_to`
--
DROP TABLE IF EXISTS `balance_to`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `balance_to` AS select `a`.`borrower_id` AS `payer_id`,`a`.`payer_id` AS `borrower_id`,-(sum(`a`.`amount`)) AS `balance` from `subtransactions` `a` group by `a`.`payer_id`,`a`.`borrower_id`;

-- --------------------------------------------------------

--
-- Structure for view `balance_union`
--
DROP TABLE IF EXISTS `balance_union`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `balance_union` AS select `balance_from`.`payer_id` AS `payer_id`,`balance_from`.`borrower_id` AS `borrower_id`,`balance_from`.`balance` AS `balance` from `balance_from` union select `balance_to`.`payer_id` AS `payer_id`,`balance_to`.`borrower_id` AS `borrower_id`,`balance_to`.`balance` AS `balance` from `balance_to`;

-- --------------------------------------------------------

--
-- Structure for view `group_balances`
--
DROP TABLE IF EXISTS `group_balances`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `group_balances` AS select sum(`subtransactions`.`amount`) AS `balance`,`transactions`.`group_id` AS `group_id`,`subtransactions`.`payer_id` AS `user_id` from (`subtransactions` left join `transactions` on((`transactions`.`id` = `subtransactions`.`transaction_id`))) group by `subtransactions`.`payer_id`,`transactions`.`group_id` union select -(sum(`subtransactions`.`amount`)) AS `balance`,`transactions`.`group_id` AS `group_id`,`subtransactions`.`borrower_id` AS `user_id` from (`subtransactions` left join `transactions` on((`transactions`.`id` = `subtransactions`.`transaction_id`))) group by `subtransactions`.`borrower_id`,`transactions`.`group_id`;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

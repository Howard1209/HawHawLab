CREATE TABLE `taiex` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `date` date,
  `open` integer,
  `high` integer,
  `low` integer,
  `close` integer
);

CREATE TABLE `stock_info` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `stock_id` varchar(10),
  `date` date,
  `open` float,
  `high` float,
  `low` float,
  `close` float,
  `spread` float,
  `spreadPCT` float,
  `amplitudePCT` float,
  `trading_volume` integer,
  `trading_turnover` integer,
  `trading_money` float,
  `foreign_investors` integer,
  `investment_trust` integer,
  `dealer_self` integer,
  `dealer_hedging` integer,
  `investors_total` integer
);

CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50),
  `email` varchar(50),
  `password` varchar(255)
);

CREATE TABLE `strategy` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `code` text COMMENT 'Content of the post',
  `user_id` integer,
  `success_rate` integer DEFAULT 0,
  `total_profit` integer DEFAULT 0,
  `maximum_loss` integer DEFAULT 0,
  `maximum_profit` integer DEFAULT 0,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE `strategy` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

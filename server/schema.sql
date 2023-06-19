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
  `open` integer,
  `high` integer,
  `low` integer,
  `close` integer,
  `spread` integer,
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
  `username` varchar(255),
  `email` varchar(255),
  `password` varchar(255)
);

CREATE TABLE `strategy` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `body` text COMMENT 'Content of the post',
  `user_id` integer
);

ALTER TABLE `strategy` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

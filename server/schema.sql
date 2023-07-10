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

CREATE TABLE `stock_list` (
  `stock_id` varchar(10) PRIMARY KEY,
  `name` varchar(255)
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
ALTER TABLE `stock_info` ADD FOREIGN KEY (`stock_id`) REFERENCES `stock_list` (`stock_id`);

INSERT INTO stock_list (stock_id, name) VALUES ('2330', '台積電');
INSERT INTO stock_list (stock_id, name) VALUES ('4919', '新唐');
INSERT INTO stock_list (stock_id, name) VALUES ('2618', '長榮航');
INSERT INTO stock_list (stock_id, name) VALUES ('2376', '技嘉');
INSERT INTO stock_list (stock_id, name) VALUES ('3035', '智原');
INSERT INTO stock_list (stock_id, name) VALUES ('8086', '宏捷科');
INSERT INTO stock_list (stock_id, name) VALUES ('2382', '廣達');
INSERT INTO stock_list (stock_id, name) VALUES ('6288', '聯嘉');
INSERT INTO stock_list (stock_id, name) VALUES ('3363', '上詮');
INSERT INTO stock_list (stock_id, name) VALUES ('6285', '啟基');
INSERT INTO stock_list (stock_id, name) VALUES ('1504', '東元');
INSERT INTO stock_list (stock_id, name) VALUES ('2486', '一詮');
INSERT INTO stock_list (stock_id, name) VALUES ('3707', '漢磊');
INSERT INTO stock_list (stock_id, name) VALUES ('2368', '金像電');


DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id int(10) auto_increment not null,
  product_name varchar(100) not null,
  department_name varchar(100) not null,
  price decimal(10, 2), 
  stock_quantity int(10) default 0,
  primary key(item_id)
);

INSERT INTO `bamazon`.`products` (`product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('Coke (20 oz.)', 'drinks', '1.5', '150');
INSERT INTO `bamazon`.`products` (`product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('chocolate chip cookies (pack of 3)', 'snacks', '1.00', '50');
INSERT INTO `bamazon`.`products` (`product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('cheezborger', 'lunch', '8.50', '3');
INSERT INTO `bamazon`.`products` (`product_name`, `department_name`, `price`, `stock_quantity`) VALUES ('cheeps', 'lunch', '1.75', '20');

SELECT * FROM bamazon.products;
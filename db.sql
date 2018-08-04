-- Dropping DB if exists --
DROP DATABASE IF EXISTS bamazon;

-- Creating DB --
CREATE DATABASE bamazon;

-- Creating Table --
CREATE TABLE products (
  id INT(10) AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  sub_department VARCHAR(255) NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  stock_quantity INT(10) NOT NULL
);

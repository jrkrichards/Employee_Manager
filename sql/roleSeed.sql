-- Drops the animals_db if it exists currently --
DROP DATABASE IF EXISTS eeManager_db;
-- Creates the "animals_db" database --
CREATE DATABASE eeManager_db;

-- Makes it so all of the following code will affect animals_db --
USE eeManager_db;

-- Creates the table "department" within eeManager_db --
CREATE TABLE department
(
    id INTEGER(11)
    AUTO_INCREMENT NOT NULL,
    name VARCHAR
    (30) NOT NULL,
    PRIMARY KEY
    (id)
);

    CREATE TABLE role
    (
        id INTEGER(11)
        AUTO_INCREMENT NOT NULL,
    title VARCHAR
        (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY
        (id)
);

        CREATE TABLE employees
        (
            id INTEGER(11)
            AUTO_INCREMENT NOT NULL,
    first_name VARCHAR
            (30) NOT NULL,
    last_name VARCHAR
            (30) NOT NULL,
    role_id INT
            (11) NOT NULL,
    manager_id INT
            (11) NOT NULL,
    PRIMARY KEY
            (id)
);
            -- Creates new rows containing data in all named columns --
            INSERT INTO department
                (name)
            VALUES
                ("Finance"),
                ("HR"),
                ("Accounting"),
                ("Tech"),
                ("Legal");

            INSERT INTO role
                (title, salary, department_id)
            VALUES
                ("CEO", 700000, 2),
                ("CFO", 500000, 1),
                ("HR Director", 500000, 2),
                ("GC", 500000, 5),
                ("Controller", 200000, 3),
                ("CTO", 500000, 4);

            INSERT INTO employees
                (first_name, last_name, role_id, manager_id)
            VALUES
                ("Head", "Honcho", 1, 1),
                ("Jacob", "Misty", 2, 1),
                ("Misty", "Jacob", 3, 1),
                ("Andrea", "Cool", 4, 1),
                ("Charlie", "Patterson", 5, 2),
                ("Emily", "Star", 6, 1);
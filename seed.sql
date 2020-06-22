


DROP DATABASE IF EXISTS company_db;
CREATE database company_db;
USE company_db;

CREATE TABLE department
(
   id INT NOT NULL
   AUTO_INCREMENT,
   depatrmentName VARCHAR
   (30) NOT NULL,
   PRIMARY KEY
   (id)
);

   CREATE TABLE roles
   (
      id INT NOT NULL
      AUTO_INCREMENT,
   title VARCHAR
      (30) NOT NULL,
   salary DECIMAL
      (10,4) NOT NULL,
   department_id INT NOT NULL,
   PRIMARY KEY
      (id)
);
      CREATE TABLE employee
      (
         id INT NOT NULL
         AUTO_INCREMENT,
   first_name VARCHAR
         (30) NOT NULL,
   last_name VARCHAR
         (30) NOT NULL,
   role_id INT NOT NULL,
   manager_id INT,
   PRIMARY KEY
         (id)
);

         -- create department
         INSERT INTO department
            (depatrmentName)
         VALUES
            ("Sales");
         INSERT INTO department
            (depatrmentName)
         VALUES
            ("Developers");
         INSERT INTO department
            (depatrmentName)
         VALUES
            ("UI/UX");
         INSERT INTO department
            (depatrmentName)
         VALUES
            ("Product");

         -- create role
         INSERT INTO roles
            (title,salary,department_id)
         VALUES
            ("Manager", 100000.6574, 1);
         INSERT INTO roles
            (title,salary,department_id)
         VALUES
            ("Senior", 9883.6574, 1);
         INSERT INTO roles
            (title,salary,department_id)
         VALUES
            ("Intern", 3455.6574, 2);
         INSERT INTO roles
            (title,salary,department_id)
         VALUES
            ("Product Manager", 100000.0000, 4);

         -- create employee
         INSERT INTO employee
            (first_name,last_name,role_id)
         VALUES
            ("Philip", "Kouchner", 2);
         INSERT INTO employee
            (first_name,last_name,role_id,manager_id)
         VALUES
            ("Bob", "Jack", 1, 1);
         INSERT INTO employee
            (first_name,last_name,role_id,manager_id)
         VALUES
            ("Idan", "Rozin", 2, 1);


         SELECT *
         FROM department;
         SELECT *
         FROM roles;
         SELECT *
         FROM employee;

         SELECT employee.first_name, employee.last_name, roles.title, department.depatrmentName, roles.salary
         FROM roles INNER JOIN employee
            ON employee.role_id = roles.id
            INNER JOIN department
            ON department.id = roles.department_id;



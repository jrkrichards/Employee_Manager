// Connecting to mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'Password',
  database: 'eemanager_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  setDep();
});

// Variables
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const { setServers } = require('dns');
const actions = ["View departments", "View roles", "View employees", "Add departments", "Add roles", "Add employees", "Update employee roles", "Exit"]
const tables = ["Department", "Role", "Employees"]
let curDepartments = []
let curRoles = []
let curEmployees = []

const currentDepartments = (value) => {
  curDepartments = JSON.stringify(value);
  console.log(curDepartments);
  setRole();
};
const currentRoles = (value) => {
  curRoles = JSON.stringify(value);
  console.log(curRoles);
  setEmployees();
};
const currentEes = (value) => {
  curEmployees = JSON.stringify(value);
  console.log(curEmployees)
  eeManage();
};

const setDep = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    currentDepartments(res);
  });
};

const setRole = () => {
  connection.query('SELECT * FROM role', (err, res) => {
      if (err) throw err;
      currentRoles(res);
    });
}

const setEmployees = () => {
  connection.query('SELECT * FROM employees', (err, res) => {
    if (err) throw err;
    currentEes(res);
  });
};

const eeManage = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: actions,
    })
    .then((answer) => {
      switch (answer.action) {
        case "View departments":
          viewDepartments();
          break;

        case "View roles":
          viewRoles();
          break;

        case "View employees":
          viewEmployees();
          break;

        case "Add departments":
          addDepartments();
          break;
        
        case "Add roles":
          addRoles();
          break;

        case "Add employees":
          addEmployees();
          break;

        case "Update employee roles":
          updateRoles();
          break;

        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Sorry ${answer.action} is not a valid action.`);
          break;
      }
    });
};

const viewDepartments = () => {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    eeManage();
  });
};

const viewRoles = () => {
  const query = 'SELECT * FROM role';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    eeManage();
  });
};

const viewEmployees = () => {
  const query = 'SELECT * FROM employees';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    eeManage();
  });
};

const addDepartments = () => {
  inquirer
    .prompt({
      name: 'addDepartment',
      type: 'input',
      message: 'What department would you like to add?',
    })
    .then((answer) => {
      const query = 'INSERT INTO department (name) VALUES (?);';
      connection.query(query, [answer.addDepartment], (err, res) => {
        if (err) throw err;
        console.log("Added the department to the database");
        eeManage();
      });
    });
};

const addRoles = () => {
  inquirer
    .prompt([
      {
      name: 'roleTitle',
      type: 'input',
      message: 'What role would you like to add?',
        },
      {
        name: 'roleSalary',
        type: 'integer',
        message: 'What is the salary of the role?',
        },
      {
        name: 'roleDepartmentId',
        type: 'integer',
        message: 'What is the department id?',
        },
    ])
    .then((answer) => {
      const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);';
      connection.query(query, [answer.roleTitle, answer.roleSalary, answer.roleDepartmentId], (err, res) => {
        if (err) throw err;
        console.log("Added the role to the database");
        eeManage();
      });
    });
};

const addEmployees = () => {
  inquirer
    .prompt([
      {
      name: 'firstName',
      type: 'input',
      message: 'What is the first name?',
        },
      {
        name: 'lastName',
        type: 'input',
        message: 'What is the last name?',
        },
      {
        name: 'role',
        type: 'input',
        message: 'What is their role?',
        },
      {
        name: 'manager',
        type: 'integer',
        message: 'What is the id of their manager?',
        },
    ])
    .then((answer) => {
      const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);';
      connection.query(query, [answer.firstName, answer.lastName, answer.role, answer.manager], (err, res) => {
        if (err) throw err;
        console.log("Added the employee to the database");
        eeManage();
      });
    });
};

const updateRoles = () => {
  console.log("Update Roles");
  eeManage();
};
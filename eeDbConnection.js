// Variables
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const actions = ["View departments", "View roles", "View employees", "Add departments", "Add roles", "Add employees", "Update employee roles", "Exit"]
const tables = ["Department", "Role", "Employees"]
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'Password',
  database: 'eeManager_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  eeManage();
});

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
  console.log("View Departments");
  eeManage();
};

const viewRoles = () => {
  console.log("View Roles");
  eeManage();
};

const viewEmployees = () => {
  console.log("View Employees");
  eeManage();
};

const addDepartments = () => {
  console.log("Add Departments");
  eeManage();
};

const addRoles = () => {
  console.log("Add Roles");
  eeManage();
};

const addEmployees = () => {
  console.log("Add Employees");
  eeManage();
};

const updateRoles = () => {
  console.log("Update Roles");
  eeManage();
};
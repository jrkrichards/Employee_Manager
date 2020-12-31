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
  setupVar();
});

// Variables
const inquirer = require('inquirer');
let curDepartments = []
let curRoles = []
let curEmployees = []
const actions = ["View departments", "View roles", "View employees", "Add departments", "Add roles", "Add employees", "Update employee roles", "Exit"]

// const fs = require('fs');
// const util = require('util');
// const { setServers } = require('dns');
// const tables = ["Department", "Role", "Employees"]

// Set up all of the needed tables as arrays so we can access them.
const setupVar = async () => {
  try {
    setDep();
    setRole();
    setEmployees();
    await eeManage();
  } catch (err) {
    console.log(err);
  }
};

const setDep = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    let length = curDepartments.length
    curDepartments.splice(0, length);
    res.forEach(({id, name}) => {
      curDepartments.push({id, name});
    });
  });
};

const setRole = () => {
  connection.query('SELECT * FROM role', (err, res) => {
      if (err) throw err;
      let length = curRoles.length;
      curRoles.splice(0, length);
      res.forEach(({id, title, salary, department_id}) => {
        curRoles.push({id, title, salary, department_id})
      });
    });
}

const setEmployees = () => {
  connection.query('SELECT * FROM employees', (err, res) => {
    if (err) throw err;
    let length = curEmployees.length;
    curEmployees.splice(0, length);
    res.forEach(({id, first_name, last_name, role_id, manager_id}) => {
      curEmployees.push({id, first_name, last_name, role_id, manager_id});
    })
  });
};

// Starting the inquirer questions.
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
    setupVar();
  });
};

const viewRoles = () => {
  const query = 'SELECT * FROM role';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    setupVar();
  });
};

const viewEmployees = () => {
  const query = 'SELECT employees.id, employees.first_name, employees.last_name, role.title, department.name, role.salary FROM employees';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    setupVar();
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
        setupVar();
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
        setupVar();
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
        type: 'integer',
        message: 'What is their role id?',
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
        setupVar();
      });
    });
};

const updateRoles = () => {
  let eeNames = []
  let roleNames = []
  curEmployees.forEach(({id, first_name, last_name}) => {
    eeNames.push(id+" "+first_name+" "+last_name);
  });
  curRoles.forEach(({id, title}) => {
    roleNames.push(id+" "+title);
  });
  inquirer
    .prompt([
      {
      name: 'eeUpdate',
      type: 'list',
      message: 'Which employee would you like to update?',
      choices: eeNames
        },
      {
      name: 'newRole',
      type: 'list',
      message: 'What is their new role?',
      choices: roleNames
        },
    ])
    .then((answer) => {
      const query = 'UPDATE employees SET role_id = ? WHERE id = ?;';
      let eeValues = answer.eeUpdate.split(" ")
      let eeId = eeValues[0]
      console.log(eeId)
      let roleValues = answer.newRole.split(" ")
      let roleId = roleValues[0]
      console.log(roleId)
      connection.query(query, [roleId, eeId], (err, res) => {
        if (err) throw err;
        console.log("Updated the role in the database");
        setupVar();
      });
    });
};
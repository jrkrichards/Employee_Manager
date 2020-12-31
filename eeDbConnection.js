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
const actions = ["View departments", "View roles", "View employees", "Add department", "Add role", "Add employee", "Update employee role", "Exit"]

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

        case "Add department":
          addDepartments();
          break;
        
        case "Add role":
          addRoles();
          break;

        case "Add employee":
          addEmployees();
          break;

        case "Update employee role":
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
  const query = 'SELECT * FROM department ORDER BY id;';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    setupVar();
  });
};

const viewRoles = () => {
  const query = 'SELECT * FROM role ORDER BY id;';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    setupVar();
  });
};

const viewEmployees = () => {
  const query = "SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name, role.salary, concat(e2.first_name,' ',e2.last_name ) AS manager FROM employees AS e1 INNER JOIN role ON role.id = e1.role_id INNER JOIN department ON department.id = role.department_id LEFT JOIN employees AS e2 ON e2.id = e1.manager_id ORDER BY e1.id;";
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
  let roles = []
  let managers = ["None"]
  curRoles.forEach(({id, title, salary}) => {
    roles.push(id+" "+title+" "+salary);
  });
  curEmployees.forEach(({id, first_name, last_name, }) => {
    managers.push(id+" "+first_name+" "+last_name);
  });
  
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
        type: 'list',
        message: 'What is their role?',
        choices: roles
        },
      {
        name: 'manager',
        type: 'list',
        message: 'Who is their manager?',
        choices: managers
        },
    ])
    .then((answer) => {
      const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);';
      let roleValues = answer.role.split(" ")
      let roleId = roleValues[0]
      let eeValues = answer.manager.split(" ")
      if(answer.manager === "None") {
        let eeId = null
        connection.query(query, [answer.firstName, answer.lastName, roleId, eeId], (err, res) => {
          if (err) throw err;
          console.log("Added the employee to the database");
          setupVar();
        });
      } else {
        let eeId = eeValues[0]
        connection.query(query, [answer.firstName, answer.lastName, roleId, eeId], (err, res) => {
          if (err) throw err;
          console.log("Added the employee to the database");
          setupVar();
        });
      }
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
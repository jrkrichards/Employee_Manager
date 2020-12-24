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
  afterConnect();
});

const afterConnect = () => {
  connection.query('SELECT * FROM employees', (err, data) => {
    if (err) throw err;
    console.log(data);
    connection.end()
  })
};

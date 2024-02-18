const inquirer = require('inquirer');
const db = require('./config/connection');

db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  init();
});

function init() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    })
    .then(answer => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          quit();
          break;
      }
  }
);}

const viewDepartments = () => {
  console.log('Viewing all departments...\n');
  db.query('SELECT * FROM departments', (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
};

const viewRoles = () => {
  console.log('Viewing all roles...\n');
  db.query('SELECT * FROM roles', (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
};

const viewEmployees = () => {
  console.log('Viewing all employees...\n');
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) throw err;
    console.table(results);
    init();
  });
};

const addDepartment = () => {
  inquirer
    .prompt({
      name: 'departmentName',
      type: 'input',
      message: 'What is the name of the department?'
    })
    .then(answer => {
      db.query(
        'INSERT INTO departments SET ?',
        {
          name: answer.departmentName
        },
        (err, result) => {
          if (err) throw err;
          console.log(`Added ${answer.departmentName} to the database.`);
          init();
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        name: 'roleTitle',
        type: 'input',
        message: 'What is the title of the role?'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of the role?'
      },
      {
        name: 'departmentId',
        type: 'input',
        message: 'What is the department id of the role?'
      }
    ])
    .then(answer => {
      db.query(
        'INSERT INTO roles SET ?',
        {
          title: answer.roleTitle,
          salary: answer.salary,
          department_id: answer.departmentId
        },
        (err, result) => {
          if (err) throw err;
          console.log(`Added ${answer.roleTitle} to the database.`);
          init();
        }
      );
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'What is the first name of the employee?'
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'What is the last name of the employee?'
      },
      {
        name: 'roleId',
        type: 'input',
        message: 'What is the role id of the employee?'
      },
      {
        name: 'managerId',
        type: 'input',
        message: 'What is the manager id of the employee?'
      }
    ]).then (answer => {
        db.query(
          'INSERT INTO employees SET ?',
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.roleId,
            manager_id: answer.managerId
          },
          (err, result) => {
            if (err) throw err;
            console.log(`Added ${answer.firstName} ${answer.lastName} to the database.`);
            init();
          }
        );
      });
};

const updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        name: 'employeeId',
        type: 'input',
        message: 'What is the employee id of the employee?'
      },
      {
        name: 'roleId',
        type: 'input',
        message: 'What is the role id of the employee?'
      }
    ])
    .then(answer => {
      db.query(
        'UPDATE employees SET ? WHERE ?',
        [
          {
            role_id: answer.roleId
          },
          {
            id: answer.employeeId
          }
        ],
        (err, result) => {
          if (err) throw err;
          console.log(`Updated employee role.`);
          init();
        }
      );
    });
};

const quit = () => {
  console.log('Goodbye!');
  process.exit();
};


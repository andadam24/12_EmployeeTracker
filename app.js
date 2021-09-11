const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();

connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'etracker_db'
});

connection.connect((err) => {
    if (err) throw err;
    startApp();
});

function startApp() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'Starting the etracker database! Select an option below?',
            choices: [
                    'View employees',
                    'View departments',
                    'View roles',
                    'Add employee',
                    'Add department',
                    'Add role',
                    'Update employee role',
                    'Exit'
                    ]
            }).then(function (answer) {
                switch (answer.action) {
                    case 'View employees':
                        viewEmployees();
                        break;
                    case 'View departments':
                        viewDepartments();
                        break;
                    case 'View roles':
                        viewRoles();
                        break;
                    case 'Add employee':
                        addEmployee();
                        break;
                    case 'Add department':
                        addDepartment();
                        break;
                    case 'Add role':
                        addRole();
                        break;
                    case 'Update employee role':
                        updateRole();
                        break;
                    case 'Exit': 
                        connection.end();

                }
        })
};

const viewEmployees = () => {
    const query = 
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
        CONCAT(manager.first_name, " ", manager.last_name) AS manager
        FROM employee
        LEFT JOIN role on role.id = employee.role_id
        LEFT JOIN department on department.id = role.department_id
        LEFT JOIN employee AS manager on manager.id = employee.manager_id`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    })
}

const viewRoles = () => {
    const query = 
        `SELECT role.id, role.title AS role, department.name AS department, role.salary
        FROM role
        LEFT JOIN department on role.department_id = department.id;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
};

const viewDepartments = () => {
    const query = 
        `SELECT id, name AS department FROM department;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
};

const addEmployee = () => {
    inquirer
      .prompt([
    {
        name: 'firstName',
        type: 'input',
        message: 'Employee first name?'
    },
    {
        name: 'lastName',
        type: 'input',
        message: 'Employee last name??'
    },
    {
      name: 'roleID',
      type: 'input',
      message: 'Employee ID number?'
    },
    {
      name: 'managerID',
      type: 'input',
      message: 'Employees manager ID number?'
    }
    ])
      .then((answer) => {
        connection.query(
          'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
          [answer.firstName, answer.lastName, answer.roleID, answer.managerID],
          (err, res) => {
            if (err) throw err;
            console.log(`Employee ${answer.firstName} ${answer.lastName} was created successfully!`);
            console.table(res)         
            startApp();
        }) 
    });
};


    const addRole = () => {
        inquirer
          .prompt([
        {
            name: 'roleName',
            type: 'input',
            message: 'Role name?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Salary for role?'
        },
        {
          name: 'deptID',
          type: 'input',
          message: 'Role department ID?'
        }
      ])
        .then((answer) => {
            connection.query(
              'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', 
              [answer.roleName, answer.salary, answer.deptID],
              (err, res) => {
                if (err) throw err;
                console.table(res)         
                startApp();
              }) 
            });
        };

        const addDepartment = () => {
            inquirer
              .prompt([
            {
                name: 'deptName',
                type: 'input',
                message: 'Department Name?'
            }
          ])
            .then((answer) => {
                connection.query(
                  'INSERT INTO department (name) VALUES (?)', 
                  [answer.deptName],
                  (err, res) => {
                    if (err) throw err;
                    console.table(res)         
                    startApp();
                  }) 
                });
            };

            const updateRole = () => {
                inquirer
                  .prompt([
                {
                    name: 'roleID',
                    type: 'input',
                    message: 'What is the roleID to update?'
                },
                {
                    name: 'roleTitle',
                    type: 'input',
                    message: 'What is the new title?'
                },
                {
                    name: 'roleSalary',
                    type: 'input',
                    message: 'What is new salary?'
                },
                {
                    name: 'roleDid',
                    type: 'input',
                    message: 'What is the new department ID?'
                },
              ])
                .then((answer) => {
                    connection.query(
                      'UPDATE role SET ? WHERE ?', 
                      [
                          {
                              title: answer.roleName
                          },
                          {
                              id: answer.roleID
                          }
                      ],
                      (err, res) => {
                        if (err) throw err;
                        console.table(res)         
                        startApp();
                      }) 
                    });
                };


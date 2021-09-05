const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
// for using environment variables
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
                        exitApp();
                        break;
                    default:
                        break;
                }
        })
};

const runEmployees = () => {
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

const runRoles = () => {
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

const getDept = () => {
    const query = 
        `SELECT id, name AS department FROM department;`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
};
const connection = require("../sql/sql.js");
const inquirer = require("inquirer");
const cTable = require('console.table');

const update = () => {
    return new Promise((resolve, reject) => {
        inquirer.prompt([{
            type: "list",
            name: "update",
            message: "Choice what to update:",
            choices: [
                "Department",
                "Roles",
                "Employee",
                "Main Menu",
                "Exit"
            ],
        }]).then(res => {
            resolve(res.update);
        }).catch(err => reject(err));
    });
}

const selectDepartment = () => {
    return new Promise((resolve, reject) => {
        inquirer.prompt([{

            type: "list",
            name: "select",
            message: "Choice what to department to update:",
            choices: [
                "Sales",
                "Developers",
                "UI/UX",
                "Product",
                "Exit"
            ],
        }]).then(res => {

            resolve(res.select);
        }).catch(err => reject(err));
    });

}


const joinDepartment = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department", (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

const updateSelectedDepartment = (id, newName) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE department SET ? WHERE ?", [{ depatrmentName: newName }, { id: id }], (err, data) => {
            err ? reject(err) : resolve({ msg: "Success" });
        });
    });
}


const joinRoles = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM roles", (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

const updateSelectedRoles = (obj, id) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE roles SET ? WHERE ?", [{ title: obj.title, salary: obj.salary, department_id: obj.department_id }, { id: id }], (err, data) => {
            err ? reject(err) : resolve({ msg: "Success" });
        });
    });
}

const createRole = (id) => {
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: "input",
                name: "titleRole",
                message: "What is the role in the company?",

            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary?",

            },

        ]).then(res => {

            var x = parseInt(res.salary);
            const ObjRole = {

                title: res.titleRole,
                salary: x,
                department_id: id,

            };
            resolve(ObjRole);
        }).catch(err => reject(err));

    });

}

const selectFromRolesToGetId = () => {

    return new Promise((resolve, reject) => {

        connection.query("SELECT id,department_id,title FROM roles", (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

const makeEmployee = () => {
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {

                type: "input",
                name: "firstName",
                message: "First Name"
            },
            {

                type: "input",
                name: "lastName",
                message: "Last Name"
            },
        ]).then(name => {

            resolve(name);
        }).catch(err => reject(err));
    });
}

const updateEmployeeWithManager = (obj, selecId, idManager, idEmployee) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE employee SET ? WHERE ?", [{ first_name: obj.firstName, last_name: obj.lastName, role_id: selecId, manager_id: idManager }, { id: idEmployee }], (err, data) => {
            err ? reject(err) : resolve({ msg: "Success1" });
        });
    });

}

const updateEmployee = (obj, selecId, idMan) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE employee SET ? WHERE ?", [{ first_name: obj.firstName, last_name: obj.lastName, role_id: selecId, manager_id: selecId }, { id: idMan }], (err, data) => {
            err ? reject(err) : resolve({ msg: "Success1" });
        });
    });

}

const employee = () => {

    return new Promise((resolve, reject) => {

        connection.query("SELECT * FROM employee", (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}



module.exports = {
    update, joinDepartment, selectDepartment, updateSelectedDepartment, joinRoles, updateSelectedRoles, createRole,
    selectFromRolesToGetId, updateEmployeeWithManager, makeEmployee, employee, updateEmployee
};

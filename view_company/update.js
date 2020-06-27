const connection = require("../sql/sql.js");
const inquirer = require("inquirer");
const cTable = require('console.table');
const add = require("./add.js");
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
        add.queryAllDepartment().then(arrAllDepartments => {
            const queryAll = [];
            for (let i = 0; i < arrAllDepartments.length; i++) {
                queryAll.push(arrAllDepartments[i].depatrmentName);
            }
            inquirer.prompt([{
                type: "list",
                name: "select",
                message: "Choice what to department to update:",
                choices: queryAll,
            }]).then(res => {
                resolve(res.select);
            }).catch(err => reject(err));
        });
    })
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

const updateEmployeeWithManager = (id) => {
    return new Promise((resolve, reject) => {
        joinRoles().then(resAllRoles => {
            const queryAllRoles = [];
            for (let i = 0; i < resAllRoles.length; i++) {
                queryAllRoles.push(resAllRoles[i].title);
            }
            employee().then(employees => {
                const queryAllEmployee = [];
                for (let i = 0; i < employees.length; i++) {
                    queryAllEmployee.push(employees[i].first_name + " " + employees[i].last_name);
                }
                inquirer.prompt([
                    {

                        type: "input",
                        name: "first",
                        message: "new first name",

                    },
                    {

                        type: "input",
                        name: "last",
                        message: "new last name",

                    },
                    {

                        type: "list",
                        name: "role",
                        message: "new role",
                        choices: queryAllRoles,

                    },
                    {

                        type: "confirm",
                        name: "confirm",
                        message: "does your employee has manager?"
                    },
                ]).then(response => {
                    if (response.confirm) {
                        inquirer.prompt({

                            type: "list",
                            name: "managerSelected",
                            message: "select who is the manager",
                            choices: queryAllEmployee
                        }).then(answerUser => {

                            let singleManager = [];
                            for (let i = 0; i < employees.length; i++) {
                                if (employees[i].first_name + " " + employees[i].last_name === answerUser.managerSelected) {
                                    singleManager.push(employees[i]);
                                }

                            }

                            let fil = resAllRoles.filter(element => {
                                return element.title === response.role;
                            });
                            connection.query("UPDATE employee SET ? WHERE ?", [{ first_name: response.first, last_name: response.last, role_id: fil[0].id, manager_id: singleManager[0].id }, { id: id }], (err, data) => {
                                err ? reject(err) : resolve({ msg: "Success1" });
                            });

                        });


                    } else {

                        const maNull = null
                        let fil = resAllRoles.filter(element => {
                            return element.title === response.role;
                        });
                        connection.query("UPDATE employee SET ? WHERE ?", [{ first_name: response.first, last_name: response.last, role_id: fil[0].id, manager_id: maNull }, { id: id }], (err, data) => {
                            err ? reject(err) : resolve({ msg: "Success1" });
                        });

                    }




                });
            });

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
    selectFromRolesToGetId, updateEmployeeWithManager, makeEmployee, employee
};

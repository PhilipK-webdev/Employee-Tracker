const connection = require("../sql/sql.js");
const inquirer = require("inquirer");
const cTable = require('console.table');
const update = require("./update.js");
const add = async () => {
    return await addCompany();
}

async function addCompany() {
    return new Promise((resolve, reject) => {
        inquirer.prompt([{
            type: "list",
            name: "add",
            message: "Choice what to add:",
            choices: [
                "department",
                "roles",
                "employee",
                "Main Menu",
                "Exit"
            ],
        }]).then(res => {
            resolve(res.add);
        }).catch(err => reject(err));
    });
}
function departmentName() {
    return new Promise((resolve, reject) => {
        inquirer.prompt([{
            type: "input",
            name: "departmentName",
            message: "What is the name of the new department?",
        }]).then(res => {
            resolve(res.departmentName);
        }).catch(err => reject(err));
    });
}

const addDepartment = async (name) => {
    return await new Promise((resolve, reject) => {
        connection.query("INSERT INTO department SET ?", [{ depatrmentName: name }], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ msg: "Successfully added!!!" });
            }
        });
    });
};

const queryAllDepartment = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department", (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

const roles = () => {
    return new Promise((resolve, reject) => {
        queryAllDepartment().then(res => {
            const queryAll = [];
            for (let i = 0; i < res.length; i++) {
                queryAll.push(res[i].depatrmentName);
            }
            inquirer.prompt([
                {
                    type: "list",
                    name: "department",
                    message: "Which department you want to add the role?",
                    choices: queryAll,
                },
            ]).then(res => {
                const result = res.department;
                resolve(result);
            }).catch(err => reject(err));

        });
    });
}

const checkDepartment = (name) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM department WHERE ?", [{ depatrmentName: name }], (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
};

const checkDepartmentAndRoles = () => {
    return new Promise((resolve, reject) => {
        connection.query(`
        SELECT roles.id, roles.title, roles.department_id, department.id, department.depatrmentName
        FROM roles INNER JOIN department
        ON roles.department_id = department.id;
        `, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
};

const checkRoleExists = (obj) => {
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
                department_id: obj[0].id,
            };

            resolve(ObjRole);
        }).catch(err => reject(err));

    });
}

const checkRoleManager = (obj) => {
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: "input",
                name: "titleRole",
                message: "What is the role in the company?",
                validate: confirmAnswer
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
                department_id: obj[0].id,
            };
            resolve(ObjRole);
        }).catch(err => reject(err));

    });

}

const addRole = (obj) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO roles SET ?", [{ title: obj.title, salary: obj.salary, department_id: obj.department_id }], (err, data) => {
            err ? reject(err) : resolve({ msg: "Success" });
        });
    });
}

const createEmployee = () => {
    return new Promise((resolve, reject) => {
        roles().then(res => {
            resolve(res);
        }).catch(err => reject(err));
    });

}
const checkdOfRolesAndDep = (name) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT roles.title, department.depatrmentName, roles.department_id,roles.salary
        FROM roles INNER JOIN department
        ON roles.department_id = department.id
        WHERE ? `, [{ depatrmentName: name }], (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

const checkIfManger = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT roles.title,department.depatrmentName,roles.department_id,roles.id
        FROM roles INNER JOIN department
        ON roles.department_id = department.id
        WHERE roles.title = "Manager"; `, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

const addEmployee = (objTemp) => {
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "Employee first name",
            },
            {
                type: "input",
                name: "lastName",
                message: "Employee last name",
            },
        ]).then(resFirstLast => {

            const id = parseInt(objTemp[0].department_id);
            console.log(id);
            inquirer.prompt({

                type: "confirm",
                name: "confirm",
                message: "does your employee has manager?"
            }).then(res => {
                if (res.confirm) {
                    update.employee().then(employees => {
                        const queryAllEmployee = [];
                        for (let i = 0; i < employees.length; i++) {
                            queryAllEmployee.push(employees[i].first_name + " " + employees[i].last_name);
                        }

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
                            console.log(singleManager[0].id);
                            connection.query("INSERT INTO employee SET ?", [{ first_name: resFirstLast.firstName, last_name: resFirstLast.lastName, role_id: id, manager_id: singleManager[0].id }],
                                (err, data) => {

                                    err ? reject(err) : resolve({ msg: "Success" });
                                });
                        });
                    });
                } else {

                    connection.query("INSERT INTO employee SET ?", [{ first_name: resFirstLast.firstName, last_name: resFirstLast.lastName, role_id: id }],
                        (err, data) => {

                            err ? reject(err) : resolve({ msg: "Success" });
                        });
                }
            });
        });
    });
}

const confirmAnswer = async (input) => {
    if (input === "Manager") {

        return "Wrong input, Try again, Manager already exists in this department";
    } else {
        return true;
    }
};

module.exports = {
    add, addDepartment, departmentName, roles,
    checkDepartment, addRole, checkRoleExists, checkDepartmentAndRoles,
    checkRoleManager, checkdOfRolesAndDep, createEmployee, addEmployee,
    checkIfManger, queryAllDepartment
};






const connection = require("../sql/sql.js");
const inquirer = require("inquirer");
const cTable = require('console.table');
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

const roles = () => {

    return new Promise((resolve, reject) => {

        inquirer.prompt([
            {
                type: "list",
                name: "department",
                message: "Which department you want to add the role?",
                choices: [
                    "Sales",
                    "Developers",
                    "UI/UX",
                    "Product",
                ],
            },
        ]).then(res => {

            const result = res.department;
            resolve(result);
        }).catch(err => reject(err));

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
        SELECT roles.id ,roles.title,roles.department_id,department.id,department.depatrmentName
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
        inquirer.prompt([
            {
                type: "input",
                name: "nameDepartment",
                message: "Which department you want to add the new employee?",

            },

            {
                type: "confirm",
                name: "ansConfirm",
                message: "Does your employee has Manager",
                default: false,
            },
        ]).then(answer => {

            resolve(answer);
        }).catch(err => reject(err));
    }).catch(err => console.log({ err: err }));

}

const checkdOfRolesAndDep = (name) => {

    return new Promise((resolve, reject) => {
        connection.query(`SELECT roles.title,department.depatrmentName,roles.department_id,roles.id
        FROM roles INNER JOIN department
        ON roles.department_id = department.id
        WHERE ?`, [{ depatrmentName: name }], (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

const checkIfManger = (name) => {

    return new Promise((resolve, reject) => {
        connection.query(`SELECT employee.first_name,roles.department_id,roles.title,employee.id
        FROM employee INNER JOIN roles
        ON employee.role_id = roles.id
        INNER JOIN department
        ON department.id = roles.department_id
        WHERE ? AND ?`, [{ title: "Manager" }, { depatrmentName: name }], (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

const addEmployee = (id) => {

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

            connection.query("INSERT INTO employee SET ?", [{ first_name: resFirstLast.firstName, last_name: resFirstLast.lastName, role_id: id }],
                (err, data) => {

                    err ? reject(err) : resolve({ msg: "Success" });
                });


        });
    });
}

const addEmployeeWithManager = (id, managerId) => {

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

            connection.query("INSERT INTO employee SET ?", [{ first_name: resFirstLast.firstName, last_name: resFirstLast.lastName, role_id: id, manager_id: managerId }],
                (err, data) => {

                    err ? reject(err) : resolve({ msg: "Success" });
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
    checkIfManger, addEmployeeWithManager
};






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


const addEmployee = () => {

    return new Promise((resolve, reject) => {

        inquirer.prompt([

            {
                type: "input",
                name: "firstName",
                message: "First Name",

            },
            {
                type: "input",
                name: "lastName",
                message: "Last Name",

            },

        ]);

    });

}


const confirmAnswer = async (input) => {


    if (input === "Manager") {

        return "Wrong input, Try again, Manager already exists in this department";
    } else {
        return true;
    }

};



module.exports = { add, addDepartment, departmentName, roles, checkDepartment, addRole, checkRoleExists, checkDepartmentAndRoles, checkRoleManager };






// } else {

//     inquirer.prompt([

//         {
//             type: "input",
//             name: "title",
//             message: "What is the role in the company?",
//         },
//         {
//             type: "input",
//             name: "salary",
//             message: "What is the salary?",
//         },

//     ]).then(res => {

//         var x = parseInt(res.salary);
//         const ObjRole = {

//             title: res.title,
//             salary: x,
//             department_id: map[i].id,

//         };
//         resolve(ObjRole);

//     }).catch(err => reject(err));



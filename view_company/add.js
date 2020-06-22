const connection = require("../sql/sql.js");
const inquirer = require("inquirer");
const cTable = require('console.table');


const add = () => {

    addCompany();
}

function addCompany() {

    inquirer.prompt([{

        type: "list",
        name: "add",
        message: "Choice what to add:",
        choices: [
            "department",
            "roles",
            "employee"
        ],

    }]).then(res => {

        switch (res.add) {
            case "department":
                departmentName();
                break;

            case "roles":
                roles();
                break;

            case "employee":
                searchMenu();
                break;

            case "Exit":
                connection.end();
                process.exit();
                break;
            default:
                break;
        }

    })



}


function departmentName() {

    inquirer.prompt([{

        type: "input",
        name: "departmentName",
        message: "What is the name of the new department?",


    }]).then(res => {

        let name = res.departmentName;
        addDepartment(name);
        addCompany();

    });

}

const addDepartment = (name) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO department SET ?", [{ depatrmentName: name }], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ msg: "Successfully added!!!" });
            }
        });
    });
};

function roles() {

    inquirer.prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department you want to add the role?",
            choices: [
                "Sales",
                "Developers",
                "UI/UX",
                "Product",
                "QA"
            ],
        },
    ]).then(res => {

        var result = res.departmentId;
        joinRolesDepartment().then(res => {

            const map = res.map(element => {

                return {
                    id: element.id,
                    title: element.title,
                    name: element.depatrmentName
                };
            });

            for (let i = 0; i < map.length; i++) {

                if (result === map[i].name && map[i].title === "Manager") {

                    console.log("Already has a manager");

                    inquirer.prompt([

                        {
                            type: "input",
                            name: "title",
                            message: "What is the role in the company?",
                        },
                        {
                            type: "input",
                            name: "salary",
                            message: "What is the salary?",
                        },

                    ]).then(res => {


                        const ObjRole = {

                            id: map[i].id,
                            title: res.title,
                            salary: res.salary
                        };

                        console.log(ObjRole);

                    });
                    // addCompany();
                }
            }
        });
    })

}

const joinRolesDepartment = () => {
    return new Promise((resolve, reject) => {
        connection.query(`
        SELECT roles.id ,roles.title,roles.department_id,department.id,department.depatrmentName
        FROM roles INNER JOIN department
        ON roles.department_id = department.id;
         `, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};





module.exports = add;
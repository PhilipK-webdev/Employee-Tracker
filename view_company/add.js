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
                readRoles().then(res => {

                    const data = res;
                    roles(data);
                });
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

function roles(data) {

    inquirer.prompt([{

        type: "input",
        name: "title",
        message: "What is the title?",
        when: (answers) => answers.title !== "Manager",
    },
    {
        type: "input",
        name: "salary",
        message: "Amount of the salary",
    },
    {
        type: "list",
        name: "departmentId",
        message: "Which department you want to add the role?",
        choices: [
            "1-Sales",
            "2-DEvelopers",
            "3-UI/UX",
            "4-Product",
            "5-QA"
        ],
    },

    ]).then(res => {

        console.log(res);

    });

}

const readRoles = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM roles `, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};


const confirmAnswer = async (input) => {



};

roles();



module.exports = add;
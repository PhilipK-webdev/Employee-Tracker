const connection = require("../sql/sql.js");
const inquirer = require("inquirer");
const cTable = require('console.table');
const { add, departmentName, addDepartment, } = require("./add.js");


const mainMenu = async () => {

    await inquirer
        .prompt([
            {
                name: "mainMenu",
                message: "Where would you like to go?",
                type: "list",
                choices: ["View all Company", "Add", "Update", "Delete", "Total Salary", "Exit"],
            },
        ])
        .then(async (res) => {
            switch (res.mainMenu) {

                case "View all Company":
                    viewCompany();
                    break;

                case "Add":
                    await add().then(res => {

                        switch (res) {

                            case "department":
                                departmentName().then(name => {
                                    addDepartment(name).then(res => console.log(res));
                                });
                                break;

                            case "roles":
                                roles();
                                break;

                            case "employee":

                                break;

                            case "Main Menu":
                                mainMenu();
                                break;

                            case "Exit":
                                connection.end();
                                process.exit();
                                break;
                            default:
                                break;
                        }
                    });
                    break;

                case "Update":
                    searchMenu();
                    break;

                case "Delete":
                    searchMenu();
                    break;

                case "Total Salary":
                    searchMenu();
                    break;

                case "Exit":
                    connection.end();
                    process.exit();
                    break;
                default:
                    break;
            }
        });
}


async function viewCompany() {

    await inquirer.prompt([{

        type: "list",
        name: "view",
        message: "View:",
        choices: [
            "department",
            "roles",
            "employee"
        ],

    }]).then(res => {

        let result = res.view;
        console.log(result);
        readAllCompany(result).then((res) => {
            const table = cTable.getTable(res);
            console.log(table);
            mainMenu();
        });

    });
}

const readAllCompany = (result) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${result} `, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = mainMenu;
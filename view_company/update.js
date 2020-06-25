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

const updateSelectedDepartment = (obj) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE department SET ? WHERE ?", [{ depatrmentName: obj.depatrmentName }, { id: obj.id }], (err, data) => {
            err ? reject(err) : resolve({ msg: "Success" });
        });
    });
}



module.exports = { update, joinDepartment, selectDepartment, updateSelectedDepartment };

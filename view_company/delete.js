const connection = require("../sql/sql.js");
const inquirer = require("inquirer");
const cTable = require('console.table');




const chooseToDelete = () => {
    return new Promise((resolve, reject) => {
        inquirer.prompt([{
            type: "list",
            name: "select",
            message: "Choice what to Delete:",
            choices: [
                "department",
                "roles",
                "employee",
                "Main Menu",
                "Exit"
            ],
        }]).then(res => {
            resolve(res.select);
        }).catch(err => reject(err));
    });
}

const queryCompany = (x) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT *  FROM ${x}`, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

const deleteFromCompany = (deleteNAme) => {
    return new Promise((resolve, reject) => {
        inquirer.prompt({
            type: "input",
            name: "id",
            message: "From the table select the id that you want to delete"
        }).then(res => {
            const idDelete = parseInt(res.id);
            connection.query(`DELETE FROM ${deleteNAme}  WHERE ?`, [{ id: idDelete }], (err, data) => {
                err ? reject(err) : resolve({ msg: "Works Good" });
            });
        });
    });
}

module.exports = { chooseToDelete, queryCompany, deleteFromCompany };
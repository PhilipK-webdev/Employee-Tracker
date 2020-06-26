const connection = require("../sql/sql.js");
const inquirer = require("inquirer");
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

const deleteFromCompanyDepartment = (queryArr, queryObj, choice) => {
    return new Promise((resolve, reject) => {
        inquirer.prompt({
            type: "list",
            name: "id",
            message: "Select what department you want to delete?",
            choices: queryArr
        }).then(res => {
            const select = queryObj.filter(element => {
                return element.depatrmentName === res.id;
            });
            console.log(select[0].depatrmentName.toLowerCase());
            connection.query(`DELETE FROM ${choice}  WHERE ?`, [{ id: parseInt(select[0].id) }], (err, data) => {
                err ? reject(err) : resolve({ msg: "Works Good" });
            });
        });
    });
}

const deleteFromCompanyRoles = (queryArr, queryObj, choice) => {
    return new Promise((resolve, reject) => {
        inquirer.prompt({
            type: "list",
            name: "id",
            message: "Select what role you want to delete?",
            choices: queryArr
        }).then(res => {
            const select = queryObj.filter(element => {
                return element.title === res.id;
            });
            connection.query(`DELETE FROM ${choice}  WHERE ?`, [{ id: parseInt(select[0].id) }], (err, data) => {
                err ? reject(err) : resolve({ msg: "Works Good" });
            });
        });
    });
}


const deleteFromCompanyEmployee = (queryArr, queryObj, choice) => {
    return new Promise((resolve, reject) => {
        inquirer.prompt({
            type: "list",
            name: "id",
            message: "Select what employee you want to delete?",
            choices: queryArr
        }).then(res => {
            const select = queryObj.filter(element => {
                return element.first_name + " " + element.last_name === res.id;
            });
            connection.query(`DELETE FROM ${choice}  WHERE ?`, [{ id: parseInt(select[0].id) }], (err, data) => {
                err ? reject(err) : resolve({ msg: "Works Good" });
            });
        });
    });
}

module.exports = { chooseToDelete, queryCompany, deleteFromCompanyDepartment, deleteFromCompanyRoles, deleteFromCompanyEmployee };
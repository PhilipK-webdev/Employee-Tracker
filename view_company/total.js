const connection = require("../sql/sql.js");
const inquirer = require("inquirer");

const salary = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM roles", (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}


module.exports = salary;
const connection = require("../sql/sql.js");
const inquirer = require("inquirer");
const cTable = require('console.table');
const { add, departmentName, addDepartment, roles, checkDepartment, addRole, checkRoleExists, checkDepartmentAndRoles } = require("./add.js");


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
                                roles().then(roleNameToDepartment => {
                                    const nameDepartment = roleNameToDepartment;
                                    checkDepartment(nameDepartment).then(resId => {

                                        const fromDepartment = resId;
                                        checkDepartmentAndRoles().then(res => {


                                            let map = res.map(element => {
                                                if (roleNameToDepartment === element.depatrmentName) {
                                                    return {

                                                        department_id: element.department_id,
                                                        depatrmentName: element.depatrmentName,
                                                        title: element.title
                                                    };
                                                }
                                            });

                                            console.log(map);
                                            map = map.filter(function (e) { return e });
                                            console.log(map);
                                            const temp = map.filter((name) => {
                                                return name.title === "Manager";
                                            });
                                            console.log(temp);
                                        });





                                        // console.log(temp);

                                        // if (temp[0].title === "Manager") {

                                        //     checkRoleExists(map, roleName).then(resObj => {

                                        //         addRole(resObj).then(res => console.log(res));

                                        //     });
                                        // }

                                        // let temp = false;

                                        // for (let i = 0; i < map.length; i++) {

                                        //     if (map[i].title === "Manager" && map[i].depatrmentName === roleNameToDepartment) {

                                        //         console.log("Yess");
                                        //         temp = false;
                                        //         const roleName = roleNameToDepartment;
                                        //     } else {

                                        //         temp = true;
                                        //         const roleName = roleNameToDepartment;
                                        //     }
                                        // }

                                        // if (temp) {


                                        //     checkRoleExists(map, roleName).then(resObj => {

                                        //         addRole(resObj).then(res => console.log(res));

                                        //     });
                                        // }



                                        // console.log(map);

                                    });

                                });
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
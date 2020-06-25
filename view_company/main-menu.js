const connection = require("../sql/sql.js");
const inquirer = require("inquirer");
const cTable = require('console.table');
const { add, departmentName, addDepartment, roles, checkDepartment, addRole, checkRoleExists,
    checkDepartmentAndRoles, checkRoleManager, checkdOfRolesAndDep, createEmployee, addEmployee,
    checkIfManger, addEmployeeWithManager

} = require("./add.js");

const { update, joinDepartment, selectDepartment, updateSelectedDepartment, joinRoles, updateSelectedRoles, createRole } = require("./update.js");



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
                                        const fromDepartmentObj = resId;
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

                                            map = map.filter(function (e) { return e });
                                            const temp = map.filter((name) => {
                                                return name.title === "Manager";
                                            });
                                            console.log(fromDepartmentObj);
                                            console.log(temp);
                                            if (temp.length === 0) {
                                                console.log("In this Department No Manager Yet");
                                                checkRoleExists(fromDepartmentObj).then(createRole => {

                                                    addRole(createRole).then(res => {
                                                        console.log(res)
                                                        mainMenu();
                                                    });
                                                });
                                            } else if (temp[0].title === "Manager") {

                                                console.log("Manager Exists");
                                                checkRoleManager(fromDepartmentObj).then(createRole => {

                                                    addRole(createRole).then(res => {
                                                        console.log(res)
                                                        mainMenu();
                                                    });
                                                });
                                            } else {

                                                console.log("Success");
                                            }
                                        });
                                    });

                                });
                                break;

                            case "employee":
                                createEmployee().then(responseNameDep => {
                                    console.log(responseNameDep);

                                    if (responseNameDep.ansConfirm) {

                                        checkIfManger(responseNameDep.nameDepartment).then(res => {
                                            const table = cTable.getTable(res);
                                            console.log(table);
                                            console.log(res[0].id);
                                            let managerId = parseInt(res[0].id);
                                            console.log(managerId);
                                            checkdOfRolesAndDep(responseNameDep.nameDepartment).then(response => {
                                                const table = cTable.getTable(response);
                                                console.log(table);
                                                inquirer.prompt({

                                                    type: "input",
                                                    name: "idUser",
                                                    message: "choice wich role you want your employee\n select the id colum",
                                                }).then(id => {
                                                    const parseId = parseInt(id.idUser);
                                                    console.log(parseId);
                                                    addEmployeeWithManager(parseId, managerId).then(() => mainMenu());
                                                })

                                            });

                                        });

                                    } else {

                                        checkdOfRolesAndDep(responseNameDep.nameDepartment).then(response => {
                                            const table = cTable.getTable(response);
                                            console.log(table);
                                            inquirer.prompt({

                                                type: "input",
                                                name: "idUser",
                                                message: "choice wich role you want your employee\n select the id colum",
                                            }).then(id => {
                                                const parseId = parseInt(id.idUser);
                                                console.log(parseId);
                                                addEmployee(parseId).then(() => mainMenu());
                                            })

                                        });

                                    }



                                });

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
                    update().then((res) => {
                        const resToUpdate = res;

                        switch (resToUpdate) {
                            case "Department":
                                selectDepartment().then(selected => {
                                    joinDepartment().then(arrDepartment => {
                                        const singleDepUpdate = arrDepartment.filter(department => {
                                            return department.depatrmentName === selected;
                                        });
                                        inquirer.prompt({

                                            type: "input",
                                            name: "newName",
                                            message: "What is the new name of the department?"
                                        }).then(resName => {
                                            parseInt(singleDepUpdate[0].id);
                                            updateSelectedDepartment(singleDepUpdate[0].id, resName.newName).then(res => {
                                                console.log(res);
                                                mainMenu();
                                            });
                                        });
                                    });
                                })
                                break;

                            case "Roles":
                                joinRoles().then(rolesObj => {

                                    console.log(rolesObj);

                                    inquirer.prompt({

                                        type: "list",
                                        name: "id",
                                        message: "Choice from what department you want to update the roles:",
                                        choices: [
                                            "1-Sales",
                                            "2-Developers",
                                            "3-UI/UX",
                                            "4-Product",
                                        ],
                                    }).then(res => {
                                        const idDepartment = res.id;
                                        console.log(rolesObj);
                                        let matches = parseInt(idDepartment.match(/(\d+)/)[0]);
                                        const filterObj = rolesObj.filter(role => {
                                            return role.department_id === matches;
                                        });
                                        let result = filterObj.map(a => a.id);
                                        inquirer.prompt({

                                            type: "list",
                                            name: "updateID",
                                            message: "Choise ID for update",
                                            choices: [
                                                `${result[0]}`,
                                                `${result[1]}`,
                                                `${result[2]}`,
                                            ]
                                        }).then(res => {
                                            const resId = parseInt(res.updateID);
                                            let objFilterID = filterObj.map(oneObj => {
                                                if (oneObj.id === resId) {

                                                    return oneObj;
                                                }
                                            });
                                            objFilterID = objFilterID.filter(function (e) { return e });
                                            console.log(objFilterID);
                                            const finalIdtoUpdate = objFilterID[0].id;
                                            createRole(objFilterID[0].department_id).then(resObj => {

                                                updateSelectedRoles(resObj, finalIdtoUpdate).then(() => mainMenu());
                                            });

                                        });

                                    });

                                });
                                break;

                            case "Employee":
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




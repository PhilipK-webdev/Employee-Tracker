const connection = require("../sql/sql.js");
const inquirer = require("inquirer");
const cTable = require('console.table');
const {
    add, departmentName, addDepartment, roles, checkDepartment, addRole, checkRoleExists,
    checkDepartmentAndRoles, checkRoleManager, checkdOfRolesAndDep, createEmployee, addEmployee,
    checkIfManger, queryAllDepartment

} = require("./add.js");

const { update, joinDepartment, selectDepartment, updateSelectedDepartment, joinRoles, updateSelectedRoles, createRole,
    selectFromRolesToGetId, updateEmployeeWithManager, makeEmployee, employee
} = require("./update.js");

const { chooseToDelete, queryCompany, deleteFromCompanyDepartment, deleteFromCompanyRoles, deleteFromCompanyEmployee } = require("./delete.js");
const salary = require("./total.js");


const mainMenu = async () => {

    await inquirer
        .prompt([
            {
                name: "mainMenu",
                message: "Where would you like to go?",
                type: "list",
                choices: ["Company By Single", "View all Company", "Add", "Update", "Delete", "Total Salary", "Exit"],
            },
        ])
        .then(async (res) => {
            switch (res.mainMenu) {
                case "Company By Single":
                    viewCompany();
                    break;
                case "View all Company":
                    viewAllJoinDepRolEmp().then(joinObj => {

                        const joinTable = cTable.getTable(joinObj);
                        console.log(joinTable);
                        mainMenu();
                    });
                    break;
                case "Add":
                    await add().then(res => {
                        switch (res) {
                            case "department":
                                departmentName().then(name => {
                                    addDepartment(name).then(() => mainMenu());
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
                                    checkIfManger().then(responseIsManagerExits => {
                                        const manager = responseIsManagerExits;
                                        checkdOfRolesAndDep(responseNameDep).then(response => {
                                            const table = cTable.getTable(response);
                                            console.log(table);
                                            let arrOfTitle = [];
                                            for (let i = 0; i < response.length; i++) {

                                                arrOfTitle.push(response[i].title);
                                            }
                                            let unique = [...new Set(arrOfTitle)];
                                            inquirer.prompt({

                                                type: "list",
                                                name: "userRole",
                                                message: "What role you want your Employee to be?",
                                                choices: unique
                                            }).then(title => {
                                                const temp = response.filter((name) => {
                                                    return name.title === title.userRole;
                                                });
                                                console.log(temp);
                                                // console.log(title.userRole);
                                                // console.log(manager, "Obj of manager-back from checkIfManager func");
                                                addEmployee(temp).then(() => mainMenu());
                                            });
                                        });
                                    });
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
                                                mainMenu();
                                            });
                                        });
                                    });
                                })
                                break;

                            case "Roles":
                                joinRoles().then(rolesObj => {
                                    console.log(rolesObj);
                                    queryAllDepartment().then(arrAllDepartments => {
                                        const queryAll = [];
                                        for (let i = 0; i < arrAllDepartments.length; i++) {
                                            queryAll.push(arrAllDepartments[i].depatrmentName);
                                        }
                                        inquirer.prompt({
                                            type: "list",
                                            name: "x",
                                            message: "Choice from what department you want to update the roles:",
                                            choices: queryAll,
                                        }).then(res => {
                                            const filterDepartment = arrAllDepartments.filter(elemenet => {
                                                return elemenet.depatrmentName === res.x;
                                            });
                                            const idChoice = filterDepartment[0].id;
                                            const filterObj = rolesObj.filter(role => {
                                                return role.department_id === idChoice;
                                            });

                                            let result = filterObj.map(a => a.title);
                                            inquirer.prompt({
                                                type: "list",
                                                name: "updateRole",
                                                message: "Choise Role for update",
                                                choices: result,
                                            }).then(res => {
                                                let objFilterID = filterObj.map(oneObj => {
                                                    if (oneObj.title === res.updateRole) {
                                                        return oneObj;
                                                    }
                                                });
                                                objFilterID = objFilterID.filter(function (e) { return e });
                                                const finalIdtoUpdate = objFilterID[0].id;
                                                createRole(objFilterID[0].department_id).then(resObj => {

                                                    updateSelectedRoles(resObj, finalIdtoUpdate).then(() => mainMenu());
                                                });
                                            });
                                        });
                                    });
                                });
                                break;

                            case "Employee":
                                selectFromRolesToGetId().then(arrRoles => {
                                    const table = cTable.getTable(arrRoles);
                                    console.log(table);
                                    employee().then(employee => {
                                        const employeeTable = cTable.getTable(employee);
                                        console.log(employeeTable);
                                        const queryAllEmployee = [];
                                        for (let i = 0; i < employee.length; i++) {
                                            queryAllEmployee.push(employee[i].first_name + " " + employee[i].last_name);
                                        }
                                        console.log(queryAllEmployee);

                                        inquirer.prompt({

                                            type: "list",
                                            name: "employeeName",
                                            message: "Choose wich employee you want to update",
                                            choices: queryAllEmployee
                                        }).then(employeeRes => {

                                            const select = employee.filter(element => {
                                                return element.first_name + " " + element.last_name === employeeRes.employeeName;
                                            });
                                            console.log(select);
                                            updateEmployeeWithManager(select[0].id).then((res) => {
                                                console.log(res);
                                                mainMenu();
                                            });
                                        });
                                    });
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
                case "Delete":
                    chooseToDelete().then(choiceDelete => {
                        if (choiceDelete === "department") {
                            queryCompany(choiceDelete).then(queryObj => {
                                const selectWhatToDelete = cTable.getTable(queryObj);
                                console.log(selectWhatToDelete);
                                const queryAll = [];
                                for (let i = 0; i < queryObj.length; i++) {
                                    queryAll.push(queryObj[i].depatrmentName);
                                }
                                console.log(queryAll);
                                deleteFromCompanyDepartment(queryAll, queryObj, choiceDelete).then(() => mainMenu());
                            });
                        } else if (choiceDelete === "roles") {
                            queryCompany(choiceDelete).then(queryObj => {
                                const selectWhatToDelete = cTable.getTable(queryObj);
                                console.log(selectWhatToDelete);
                                const queryAll = [];
                                for (let i = 0; i < queryObj.length; i++) {
                                    queryAll.push(queryObj[i].title);
                                }
                                console.log(queryAll);
                                deleteFromCompanyRoles(queryAll, queryObj, choiceDelete).then(() => mainMenu());
                            });
                        } else {
                            queryCompany(choiceDelete).then(queryObj => {
                                const selectWhatToDelete = cTable.getTable(queryObj);
                                console.log(selectWhatToDelete);
                                const queryAll = [];
                                for (let i = 0; i < queryObj.length; i++) {
                                    queryAll.push(queryObj[i].first_name + " " + queryObj[i].last_name);
                                }
                                deleteFromCompanyEmployee(queryAll, queryObj, choiceDelete).then(() => mainMenu());
                            });
                        }
                    });
                    break;
                case "Total Salary":
                    salary().then(allRolesWithSalary => {
                        let objSalary = [];
                        let totalSalaryCompany = 0;
                        for (let i = 0; i < allRolesWithSalary.length; i++) {
                            if (typeof allRolesWithSalary[i].salary === "number") {
                                objSalary.push(allRolesWithSalary[i].salary);
                            }
                        }
                        for (let i = 0; i < objSalary.length; i++) {
                            totalSalaryCompany += objSalary[i];
                        }

                        console.log(totalSalaryCompany);
                        mainMenu();
                    });
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
        readAllCompany(result).then((res) => {
            const table = cTable.getTable(res);
            console.log(table);
            mainMenu();
        });

    });
}

const readAllCompany = (result) => {
    return new Promise((resolve, reject) => {
        if (result === "department") {
            connection.query(`SELECT depatrmentName FROM ${result} `, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } else if (result === "roles") {

            connection.query(`SELECT department_id,title FROM ${result} `, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } else {
            connection.query(`SELECT first_name,last_name,role_id,manager_id FROM ${result} `, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }

    });
};


const viewAllJoinDepRolEmp = () => {
    return new Promise((resolve, reject) => {
        connection.query(`
        SELECT employee.first_name,employee.last_name,roles.title,department.depatrmentName,roles.salary
        FROM department RIGHT JOIN employee
        ON department.id = employee.role_id
        LEFT JOIN roles
        ON  roles.id= employee.role_id;
        `, (err, data) => {

            err ? reject(err) : resolve(data);
        })
    })
}

module.exports = mainMenu;




const connection = require("./sql/sql.js");
const mainMenu = require("./view_company/main-menu.js");
connection.connect(err => {

    if (err) throw err;
    console.log(`We have been connected`);
    mainMenu();
});
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sws_ai"
});

connection.connect((err) => {

    if(err){
        console.log("Database Error:", err);
    } else {
        console.log("MySQL Connected");
    }

});

module.exports = connection;
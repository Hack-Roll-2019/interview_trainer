const express = require('express');
const path = require("path");
const mysql = require("mysql");


const app = express();

const flash = require('connect-flash');


const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
    password: 'J4m35Y@P',
    database: 'interview_excel',
    insecureAuth: true
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected");
})

// routes ================================
require('./app/routes.js')(app, connection);

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.listen(5000, process.env.IP);
console.log("Server running at localhost:5000");

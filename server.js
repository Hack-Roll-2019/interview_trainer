const express = require('express');
const path = require("path");
const mysql = require("mysql");

const app = express();

const flash = require('connect-flash');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'hacknroll'
});

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://interview-excel.firebaseio.com'
// });

// const database = admin.database();
// const auth = admin.auth();

// routes ================================
require('./app/routes.js')(app, connection);

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const server = app.listen(5000, process.env.IP);
console.log("Server running at localhost:5000");

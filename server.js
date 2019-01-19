const express = require('express');
const path = require("path");
const mysql = require("mysql");

const app = express();

const flash = require('connect-flash');

const serviceAccount = require('./interview-excel-firebase-adminsdk-lqfnx-2e79357d5a.json');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
    password: 'root',
    database: 'interview_excel'
});

connection.connect(err => {
    if (err) throw err;
    console.log("Connected");
})


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


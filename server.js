const express = require('express');
const path = require("path");
const mysql = require("mysql");

const spawn = require('child_process').spawn,

    // directory naming should be fixed to allow for both Windows and Mac
    // video directory should be replaced with var containing video link
 dummy  = spawn('python', ['openCV/main.py', 'E:/HackRoll/videoplayback.mp4']);

dummy.stdout.on('data', (data) => {
    console.log(data)
});

const app = express();

const flash = require('connect-flash');

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

// routes ================================
require('./app/routes.js')(app, connection);

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.listen(5000, process.env.IP);
console.log("Server running at localhost:5000");


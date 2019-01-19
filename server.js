const express = require('express');
const path = require("path");
const app = express();

const flash = require('connect-flash');

// routes ================================
require('./app/routes.js')(app, database, auth);

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const server = app.listen(5000, process.env.IP);
console.log("Server running at localhost:5000");

var sys   = require('sys'),
    spawn = require('child_process').spawn,
    dummy  = spawn('python', ['openCV/main.py', '/Users/jamesyaputra/Dekstop/video.mp4']);

dummy.stdout.on('data', function(data) {
    sys.print(data.toString());
});
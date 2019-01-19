const express = require('express');
const path = require("path");
const app = express();

const flash = require('connect-flash');

const admin = require('firebase-admin');
const serviceAccount = require('./interview-excel-firebase-adminsdk-lqfnx-2e79357d5a.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://interview-excel.firebaseio.com'
});

const database = admin.database();
const auth = admin.auth();

// routes ================================
require('./app/routes.js')(app, database, auth);

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const server = app.listen(5000, process.env.IP);
console.log("Server running at localhost:5000");


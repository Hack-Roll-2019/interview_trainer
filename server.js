const express = require('express');
const app = express();

const admin = require('firebase-admin');
const serviceAccount = require('./interview-excel-firebase-adminsdk-lqfnx-2e79357d5a.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://interview-excel.firebaseio.com'
});

const database = admin.database();

// routes ================================
require('./app/routes.js')(app, database)
const server = app.listen(5000, process.env.IP);


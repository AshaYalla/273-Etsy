const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var constants = require("./config.json");
var cors = require('cors');
const session = require('express-session');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));



var connection = mysql.createConnection({
  host     : constants.DB.hostname,
  user     : constants.DB.username,
  password : constants.DB.password,
  port     : constants.DB.port
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

connection.end();
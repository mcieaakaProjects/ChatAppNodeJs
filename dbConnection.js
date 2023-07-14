const mysql= require('mysql2');
const dotenv = require('dotenv');

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '24Oct2001*',
    database : 'auth'
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });


module.exports= db;
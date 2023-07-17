const mysql= require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

var db = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

module.exports= db;
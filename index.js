var mysql = require('mysql2');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const bcrypt = require('bcrypt');
var connection= require('./dbConnection');
var cookieParser = require('cookie-parser');

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());


//SIGNUP-------------------------------------------------------
app.get('/', (request, response)=> {
    response.sendFile(path.join(__dirname + '/signup.html'));
});

app.post('/auth_signup',(request, response) =>{
    var username = request.body.username;
    var email= request.body.mailid;
    var password = request.body.password;

	const salt = bcrypt.genSaltSync(10);
    const password_Digest = bcrypt.hashSync(password, salt);
	   

    if (username && email && password) {
        connection.query('INSERT INTO userdetails VALUES (0, ?, ?, ?)', [username, password_Digest, email], function(error, results, fields) {
            if (!error) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/login');
            } else {
                response.send('An error occurred during signup: ' + error);
            }           
            response.end();
        });
    } else {
        response.send('Please enter Username,Email and Password!');
        response.end();
    }
});


//LOGIN------------------------------------------------------------
app.get('/login', (request, response)=> {
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', (request, response)=> {
    var username = request.body.username;
    var password = request.body.password;
	const salt = bcrypt.genSaltSync(10);
    const password_Digest = bcrypt.hashSync(password, salt);
    
  if (username && password) {
    connection.query('SELECT * FROM userdetails WHERE username = ?', [username], (error, results, fields) => {
      if ( !error && results.length > 0) {
        const storedPasswordDigest = results[0].password_digest;
        bcrypt.compare(password, storedPasswordDigest, (err, isMatch) => {
          if (isMatch) {
            request.session.loggedin = true;
            request.session.username = username;
            response.cookie('loggedIn', true); // Set the cookie
            response.redirect('/logout');
          } else {
            response.send('Incorrect Username and/or Password!');
          }
          response.end();
        });
      } else {
        response.send('Incorrect Username and/or Password!');
        response.end();
      }
    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});  

app.get('/home', (request, response)=> {
    if (request.session.loggedin) {
        response.send('Welcome, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

//LOGOUT--------------------------------------------------------
app.get('/logout', (request, response)=> {
    response.sendFile(path.join(__dirname + '/logout.html'));
});

app.post('/auth_logout', (request, response)=> {
	request.session.destroy(function (error) {
		if (!error) {
			response.clearCookie('loggedIn'); 
			response.send('Logged out. Thanks for visiting!');
		} else {
			response.send('An error occurred during logout.');
		}
		response.end();
	});
});

//middleware
//explore sockets

app.listen(3000, () => {
    console.log("Listening on 3000");
});

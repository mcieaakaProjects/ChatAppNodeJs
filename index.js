const mysql= require('mysql2');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const signupRoute = require('./routes/signupRoute');
const loginRoute = require('./routes/loginRoute');
const logoutRoute = require('./routes/logoutRoute');
const landingPageRoute = require('./routes/landingPageRoute');
const userProfileRoute = require('./routes/userProfileRoute');
const homeRoute = require('./routes/homeRoute');

const app = express();

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('views'));

app.use('/', signupRoute);
app.use('/', loginRoute);
app.use('/', logoutRoute);
app.use('/', landingPageRoute);
app.use('/', userProfileRoute);
app.use('/', homeRoute);


app.listen(3000, () => {
  console.log('Listening on 3000');
});

// signup/login---->welcome/landing page-->user profile-->logout
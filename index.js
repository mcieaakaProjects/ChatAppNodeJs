const mysql= require('mysql2');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
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

app.use('/', authRoutes);
app.use('/', homeRoutes);
app.use('/', logoutRoutes);

app.listen(3000, () => {
  console.log('Listening on 3000');
});

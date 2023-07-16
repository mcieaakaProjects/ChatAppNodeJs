const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const connection = require('../dbConnection');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../signup.html'));
});

router.post('/auth_signup', async (req, res) => {
  try {
    const { username, mailid, password } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    if (username && mailid && password) {
      await connection.promise().query('INSERT INTO userdetails VALUES (0, ?, ?, ?)', [username, passwordHash, mailid]);
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect('/login');
    } else {
      res.send('Please enter Username, Email, and Password!');
    }
  } catch (error) {
    res.send('An error occurred during signup: ' + error);
  }
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../login.html'));
});
router.post('/auth', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (username && password) {
        const [results] = await connection.promise().query('SELECT * FROM userdetails WHERE username = ?', [username]);
        if (results.length > 0) {
          const storedPasswordHash = results[0].password_digest;
          const isMatch = await bcrypt.compare(password, storedPasswordHash);
          if (isMatch) {
            req.session.loggedin = true;
            req.session.username = username;
            res.cookie('loggedIn', true);
            res.redirect('/logout');
          } else {
            res.send('Incorrect Username and/or Password!');
          }
        } else {
          res.send('Incorrect Username and/or Password!');
        }
      } else {
        res.send('Please enter Username and Password!');
      }
    } catch (error) {
      res.send('An error occurred during login: ' + error);
    }
  });

  router.get('/logout', (req, res) => {
    res.sendFile(path.join(__dirname, '/logout.html'));
  });
  router.post('/auth_logout', (req, res) => {
    req.session.destroy(function (error) {
      if (!error) {
        res.clearCookie('loggedIn'); // Clear the cookie
        res.send('Logged out. Thanks for visiting!');
      } else {
        res.send('An error occurred during logout.');
      }
    });
  });

module.exports = router;

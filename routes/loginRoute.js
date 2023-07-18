const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const connection = require('../dbConnection');

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../pageFiles/login.html'));
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
              res.redirect('/landingPage');
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
    
module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const connection = require('../dbConnection');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../pageFiles/signup.html'));
});
router.post('/auth_signup', async (req, res) => {
  console.log(req.body);
  try {
    const { username, mailid, password } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    if (username && mailid && password) {
      await connection.promise().query('INSERT INTO userdetails VALUES (0, ?, ?, ?)', [username, passwordHash, mailid]);
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect('/userProfile');
    } else {
      res.send('Please enter Username, Email, and Password!');
    }
  } catch (error) {
    res.send('An error occurred during signup: ' + error);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const connection = require('../dbConnection');

router.get('/chatPage', (req, res) => {
    if (req.session.loggedin && req.session.username) {
      res.sendFile(path.join(__dirname, '../pageFiles/chatPage.html'), { username: req.session.username });
    } else {
      res.redirect('/login');
    }
  });
  
  
router.post('/auth_chat', (req, res) => {
    var action = req.body.action;
  
    if (action === 'chat') {
      res.redirect('/chatPage');
    } else {
      res.send('Invalid action!');
      res.end();
    }
  });
  
  module.exports = router;
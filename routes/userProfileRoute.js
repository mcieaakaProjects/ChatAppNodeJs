const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../dbConnection');

router.get('/userProfile', (req, res)=> {
    res.sendFile(path.join(__dirname, '../pageFiles/userProfile.html'));
  });
router.post('/auth_userProfile', (req, res)=> {
    var current_username = req.body.current_username;
    var new_username = req.body.new_username;
    var mailid   = req.body.mailid;
    var action = req.body.action;
    if (action === 'save') {
      if (current_username && new_username && mailid) {
        connection.query('UPDATE userdetails SET username = ?, email = ? WHERE username = ?', [new_username, mailid, current_username], (error, results, fields) => {
          if (!error) {
            req.session.new_username = new_username; // Update the session username
            res.send('Welcome, ' + req.session.new_username + '!');
          } else {
            res.send('An error occurred!');
            res.end();
          }
        });
      } else {
        res.send('Please enter details in all the fields!');
        res.end();
      }
    } else if (action === 'logout') {
      req.session.destroy(function (error) {
        if (!error) {
          res.clearCookie('loggedIn'); // Clear the cookie
          res.redirect('/logout');
        } else {
          res.send('An error occurred during logout.');
          res.end();
        }
      });
    } else {
      res.send('Invalid action!');
      res.end();
    }
 });
   
module.exports = router;









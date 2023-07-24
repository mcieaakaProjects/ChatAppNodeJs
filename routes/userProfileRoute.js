const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../dbConnection');
const middleware = require('../pageFiles/middleware');

router.get('/userProfile', (req, res)=> {
    res.sendFile(path.join(__dirname, '../pageFiles/userProfile.html'));
  });
router.post('/auth_userProfile', middleware, (req, res)=> {
    var current_username = req.body.current_username;
    var new_username = req.body.new_username;
    var mailid   = req.body.mailid;
      if (current_username && new_username && mailid) {
        connection.query('UPDATE userdetails SET username = ?, email = ? WHERE username = ?', [new_username, mailid, req.session.username], (error, results, fields) => {
          if (!error) {
            res.send('Welcome, ' + new_username + '!');
          } else {
            res.send('An error occurred!');
            res.end();
          }
        });
      } else {
        res.send('Please enter details in all the fields!');
        res.end();
      }
      });
   
module.exports = router;









const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
  if (req.session.loggedin) {
    res.send('Welcome, ' + req.session.username + '!');
  } else {
    res.send('Please login to view this page!');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, '../pageFiles/logout.html'));
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

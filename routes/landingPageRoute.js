const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/landingPage', (req, res)=> {
    res.sendFile(path.join(__dirname, '../pageFiles/landingPage.html'));
  });
router.post('/auth_landingPage', (req, res) => {
    var error = null; 
    if (!error) {
      res.redirect('/userProfile');
    } else {
      res.send('An error occurred.');
    }
    res.end();
});
    
module.exports = router;
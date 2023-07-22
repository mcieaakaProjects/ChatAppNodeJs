const express = require('express');
const router = express.Router();
const path = require('path');
const middleware= require('../pageFiles/middleware.js');

router.get('/landingPage', middleware, (req, res)=> {
    res.sendFile(path.join(__dirname, '../pageFiles/landingPage.html'));
  });

    
module.exports = router;
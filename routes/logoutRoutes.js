const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, '../logout.html'));
});

module.exports = router;

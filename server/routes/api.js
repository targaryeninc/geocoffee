const express = require('express');

const router = express.Router();

router.get('/business', (req, res, next) => {
  return res.send('Hello, world');
});

module.exports = router;

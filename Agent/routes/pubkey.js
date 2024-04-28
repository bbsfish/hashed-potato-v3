/**
 * /pubkey
 */
const express = require('express');
const router = express.Router();

router.get('/', viewIndex);

function viewIndex(req, res) {
  res.lr({
    title: 'pubkey',
    body: 'pubkey/index.ejs',
  });
}

module.exports = router;

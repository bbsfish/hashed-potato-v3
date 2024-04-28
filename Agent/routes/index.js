/**
 * /(root)
 */
const express = require('express');
const router = express.Router();

router.get('/', viewIndex);

function viewIndex(req, res) {

}

module.exports = router;

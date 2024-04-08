/**
 * partners > main
 * Router '/partners'
 */

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

/* Middleware */
router.use((req, res, next) => {
  // 特定のオリジンからアクセスを許可する
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/* Methods */
router.get('/', viewIndex);

/**
 * View Partners Index
 * @param {*} req request
 * @param {*} res response
 */
function viewIndex (req, res) {
  res.render('partners/index');
}

module.exports = router;

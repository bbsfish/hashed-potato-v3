const express = require('express');
const router = express.Router();
const tojson = require('json-format');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  );

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
});

router.get('http://localhost:5500/login/')
router.post('/signup', view);
router.post('/signin', view);


async function view(req, res) {
  const body = req.body;
  console.group(req.url);
  console.info('POST body - ', body);
  res.render('preview.ejs', {
    message: 'パートナーサイトのリダイレクトページです',
    status: 'クライアントより POST されたデータ',
    stack: tojson(body),
  });
  console.groupEnd();
}

module.exports = router;

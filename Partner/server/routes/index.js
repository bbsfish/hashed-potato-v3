const express = require('express');
const router = express.Router();
const tojson = require('json-format');

router.use(function(req, res, next) {
  console.log(req.session);
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

/**
 * ウェブサイト表示
 */
router.get('/', viewIndex);
router.get('/signin', viewSignIn);
router.get('/signup', viewSignUp);

/**
 * サインイン/サインアップ情報受け取りエンドポイント
 * クライアントが情報を POST してくる
 */
router.post('/redirect', view);

function viewIndex(req, res) {
  res.render('index.ejs');
}

function viewSignIn(req, res) {
  res.render('verification.ejs', {
    VERIFICATION_TYPE: 'SignIn'
  });
}

function viewSignUp(req, res) {
  res.render('verification.ejs', {
    VERIFICATION_TYPE: 'SignUp'
  });
}

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

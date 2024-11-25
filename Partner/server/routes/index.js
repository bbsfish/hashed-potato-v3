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

/**
 * ウェブサイト表示
 */
router.get('/', viewIndex);
router.get('/signin', viewSignIn);
router.get('/signup', viewSignUp);
router.get('/redirect', viewRedirect);

/**
 * サインイン/サインアップデータ取得エンドポイント
 * サインイン/サインアップデータをブラウザ表示するための API
 */
router.get('/signeddata', getSignedData);

/**
 * サインイン/サインアップ情報受け取りエンドポイント
 * クライアントが情報を POST してくる
 */
router.post('/redirect', afterVerification);

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

function viewRedirect(req, res) {
  res.render('preview.ejs');
}

/**
 * クライアントから送られたデータを一時保管する変数
 */
let signedData = {
  isNew: false,
  data: null,
}
async function afterVerification(req, res) {
  const body = req.body;
  signedData.isNew = true;
  signedData.data = body;
  console.info('POST body - ', body);
  res.render('preview.ejs', {
    message: 'パートナーサイトのリダイレクトページです',
    status: 'クライアントより POST されたデータ',
    stack: tojson(body),
  });
}
function getSignedData(req, res) {
  res.json(signedData);
  if (signedData.isNew) signedData.isNew = false;
}

module.exports = router;

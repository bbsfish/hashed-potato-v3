const express = require('express');
const router = express.Router();
const tojson = require('json-format');

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

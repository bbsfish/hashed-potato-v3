/**
 * agent > main
 * Router '/agent'
 */

require('dotenv').config();
const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const Firestore = require('@google-cloud/firestore');
const firedb = new Firestore({
  projectId: 'univ-390010',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

/* Middleware */
router.use((req, res, next) => {
  // すべてのオリジンからアクセスを許可する
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/* Methods */
router.post('/link/stock', linkStock);
router.get('/link/fetch/:id', linkFetch);

/**
 * Adds link request objects into Firestore
 * @param {object} req request handle
 * @param {object} res response handle
 * @return {JSON} server response
 *  -> {reception_id: '7e5242fa-2ad6-445c-aa39-203c35cdff66'}
 */
async function linkStock (req, res) {
  const body = req.body;
  const dt = new Date();
  Object.assign(body, {
    requested_time: dt.getTime(),
    expires_time: dt.getTime() + 1000*60*5 // 5 min *1000ms=1s
  });
  const result = await firedb.collection('link_requests').add(body);
  console.log('result.id', result.id);
  return res.json({reception_id: result.id});
}

/**
 * Fetch link request objects from Firestore
 * @param {object} req request handle
 * @param {object} res response handle
 * @return {JSON} server response
 *  -> server response sample is below
 * 'requested_time': 1705135956571,
 * 'self_request_auth': 'temp_token',
 * 'self_request_auth_value': '123456',
 * 'scope': ['fullname','phonenumber'],
 * 'redirect_uri': 'http://localhost:3000/endpoint',
 * 'type': 'login_bridge',
 * 'expires_time': 1705136256571,
 * 'requester_id': 'hogehoge.serviceX.sample'
 */
async function linkFetch (req, res) {
  const id = req.params.id;
  const result = await firedb.collection('link_requests').doc(id).get();
  if (!result.exists) return res.end();
  console.log('result.data', result.data);
  return res.json(result.data());
}


module.exports = router;

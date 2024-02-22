/**
 * devicefile > main
 * Router '/devicefile'
 */

require('dotenv').config();
const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const crypto = require('crypto');

/* Middleware */
router.use((req, res, next) => {
  // 特定のオリジンからアクセスを許可する
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/* Methods */
router.get('/createid', createDeviceFileId);

/**
 * Generate UUID for Device File ID
 * @param {Object} req request
 * @param {Object} res response
 * @return {Obejct} res.json
 *  -> {device_file_id: '7e5242fa-2ad6-445c-aa39-203c35cdff66'}
 */
function createDeviceFileId (req, res) {
  let n = 0;
  const addID = function () {
    if (n > 3) return res.end();
    n++;

    const uuid = crypto.randomUUID();

    return res.json({device_file_id: uuid});

    // const db = sqlite.init(sqlite.LS.AS);
    // const query = `INSERT INTO device_file_id (device_file_id) VALUES (?)`;
    // db.run(query, [uuid], (err) => {
    //   db.close();
    //   if (err) {
    //     console.error(err);
    //     addID();
    //   } else {
    //     return res.json({device_file_id: uuid});
    //   }
    // });
  };

  return addID();
}

module.exports = router;

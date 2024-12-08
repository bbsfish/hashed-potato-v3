const express = require('express');
const router = express.Router();
const Database = require('../lib/database.js');
const Partners = class extends Database {
	constructor() {
		super('partners.db');
	}
};
const Logger = require('../lib/logger.js');
const logger = new Logger('Index');
const token = require('../lib/token.js');
const TIME_LIMIT = 1000 * 60 * 10;
const TOKEN_LENGTH = 128;

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

router.use((req, res, next) => {
  logger.log('[%s] %s - %O', req.method, req.originalUrl, req.body);
  next();
});

router.get('/', viewRegistraion);
router.post('/registration', registerPartnerId);
router.post('/store', storePartnerData);
router.get('/data/:receptionId', getPartnerData);
router.get('/ping', checkTime);

function viewRegistraion(req, res) {
  res.render('registraion.ejs', {
    NEW_TOKEN: '',
    PHASE: 'form',
  });
}

function registerPartnerId(req, res) {
  const db = new Partners();
  const { pid } = req.body;
  const newToken = token.generate(TOKEN_LENGTH);
  db.run(
    'INSERT INTO partners(id, hash) VALUES(?,?)',
    [ pid, newToken ],
    (err) => {
      if (err !== null) res.render('registraion.ejs', {
        NEW_TOKEN: '',
        PHASE: 'error',
      });
      else res.render('registraion.ejs', {
        NEW_TOKEN: newToken,
        PHASE: 'ok',
      }); 
      db.close();
    }
  );
}

async function storePartnerData(req, res) {
  try {
    logger.log(req.body);
    const {
      requester_id,
      hash,
      redirect_uri,
      scope,
      type,
    } = req.body;
    const db = new Partners();
    const partner = await db.get(
      'SELECT * FROM partners WHERE (id, hash) = (?, ?)',
      [ requester_id, hash ]
    );

    if (!partner) {
      return res.json({
        ok: false,
        error: 'Invalid Token',
      });
    }

    const now = new Date();
    const requested_time = now.getTime();
    const expires_time = now.getTime() + TIME_LIMIT;
    const rId = token.generate(16).replaceAll('/', '.');

    db.run(
      `INSERT INTO receptions(
        id, requester_id, redirect_uri, scope, type, requested_time, expires_time
      ) VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [ rId, requester_id, redirect_uri, scope.join('/'), type, requested_time, expires_time ],
    );
    db.close();
    return res.json({
      ok: true,
      reception_id: rId,
    }); 
  } catch (error) {
    logger.error(error);
    return res.json({
      ok: false,
      error: 'Unknown Error',
    });
  }
}

async function getPartnerData(req, res) {
  const { receptionId } = req.params;
  try {
    const receptions = await (async () => {
      const db = new Partners();
      const info = await db.get(
        `SELECT * FROM receptions WHERE id = ?`,
        [ receptionId ]
      );
      return info;
    })();

    if (new Date().getTime() > receptions.expires_time) {
      return res.json({
        ok: false,
        error: 'Reception ID expired',
      });
    }

    Object.assign(receptions, { ok: true });
    return res.json(receptions);
  } catch(err) {
    return res.json({
      ok: false,
      error: 'Invalid Reception ID',
    });
  }
}

function checkTime(req, res) {
  return res.send('Hello!');
} 

module.exports = router;

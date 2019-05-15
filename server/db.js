const { Pool } = require('pg');
const { rebuildDbStatment } = require('./dbSetup.js');
/*
const dbUsername = 'mnikspkw'
const dbPassword username = 'OyLow4C4v5Dxea9Y-JbxStELP1vlkaxj'
const dbHost = '@isilo.db.elephantsql.com'
const dbDatabase = 'mnikspkw'
const dbPort = '5432'
*/

const URI = process.env.POSTGRES_URI
  || 'postgres://mnikspkw:OyLow4C4v5Dxea9Y-JbxStELP1vlkaxj@isilo.db.elephantsql.com:5432/mnikspkw';

const pool = new Pool({
  connectionString: URI,
});

// to DROP and re-create the database schema, set following to true
const resetDb = false;
if (resetDb) {
  pool
    .query(rebuildDbStatment)
    .then(res => console.log('db deleted and recreated. ', res))
    .catch(e => setImmediate(() => {
      throw e;
    }));
}

module.exports = pool;

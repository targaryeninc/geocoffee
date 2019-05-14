const { Pool } = require('pg');

// elephantSQL URI here
const URI = process.env.POSTGRES_URI || '';

const pool = new Pool({
  connectionString: URI,
});

pool.on('connect', () => console.log('connected to PSQL DB'));

module.exports = pool;

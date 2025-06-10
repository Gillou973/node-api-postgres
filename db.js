require('dotenv').config(); // Ajoute cette ligne en haut
const { Pool } = require('pg');

const pool = new Pool({
/*   user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT, */
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
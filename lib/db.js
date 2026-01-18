import { Pool } from 'pg';

// Remove sslmode from connection string to avoid conflict with ssl config
const connectionString = process.env.DATABASE_URL
  ?.replace(/(\?)sslmode=[^&]+&?/, '$1')  // sslmode is first param
  ?.replace(/&sslmode=[^&]+/, '')          // sslmode is not first param
  ?.replace(/\?$/, '');                    // clean trailing ?

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}



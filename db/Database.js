const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = null;
  }

  connect() {
    if (this.pool) {
      return this.pool;
    }

    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: process.env.DB_POOL_MAX || 20,
      idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || 30000,
      connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT || 2000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    return this.pool;
  }

  async query(text, params) {
    const pool = this.connect();
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async getClient() {
    const pool = this.connect();
    return await pool.client();
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

module.exports = new Database();

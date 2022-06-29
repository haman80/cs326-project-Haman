import 'dotenv/config';
import pg from 'pg';

// Get the Pool class from the pg module.
const { Pool } = pg;

export class Database {
  constructor(dburl) {
    this.dburl = dburl;
  }

  async connect() {
    this.pool = new Pool({
      connectionString: this.dburl,
      ssl: { rejectUnauthorized: false }, // Required for Heroku connections
    });

    // Create the pool.
    this.client = await this.pool.connect();
    
    // Init the database.
    await this.init();
  }

  async init() {
    const queryText = `
      create table if not exists watchedList (
        name varchar(30) ,
        year integer,
        rating float
      );

      create table if not exists wishList (
        name varchar(30),
        year integer
      );
    `;
    const res = await this.client.query(queryText);
  }

  // Close the pool.
  async close() {
    this.client.release();
    await this.pool.end();
  }

  //Handling the Watch List
  async addWatchList(name, year, rating) {
    const queryText =
      'INSERT INTO watchedList (name, year, rating) VALUES ($1, $2, $3) RETURNING *';
    const res = await this.client.query(queryText, [name, year, rating]);
    return res.rows;
  }

  async delWatchList(name, year) {
    const queryText =
      'DELETE FROM watchedList WHERE name=$1 AND year::text=$2;';
    const res = await this.client.query(queryText, [name, year]);
    return res.rows;
  }

  async updateWatchList(name, year, rating) {
    const queryText =
      'UPDATE watchedList SET rating = $1 WHERE name=$2 AND year=$3;';
    const res = await this.client.query(queryText, [rating, name, year]);
    return res.rows;
  }

  async readWatchList() {
    const queryText =
      'SELECT * FROM watchedList;';
    const res = await this.client.query(queryText);
    return res.rows;
  }

  //Handling Wish List
  async addWishList(name, year) {
    const queryText =
      'INSERT INTO wishList (name, year) VALUES ($1, $2) RETURNING *';
    const res = await this.client.query(queryText, [name, year]);
    return res.rows;
  }

  async delWishList(name, year) {
    const queryText =
      'DELETE FROM wishList WHERE name=$1 AND year::text=$2;';
    const res = await this.client.query(queryText, [name, year]);
    return res.rows;
  }

  async readWishList() {
    const queryText =
      'SELECT * FROM wishList;';
    const res = await this.client.query(queryText);
    return res.rows;
  }
  
}
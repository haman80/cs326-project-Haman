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
        rating float, 
        userID varchar(30)
      );

      create table if not exists wishList (
        name varchar(30),
        year integer,
        userID varchar(30)
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
  async addWatchList(name, year, rating, userID) {
    const queryText =
      'INSERT INTO watchedList (name, year, rating, userID) VALUES ($1, $2, $3, $4) RETURNING *';
    const res = await this.client.query(queryText, [name, year, rating , userID]);
    return res.rows;
  }

  async delWatchList(name, year, userID) {
    const queryText =
      'DELETE FROM watchedList WHERE userID = $1 AND name=$2 AND year::text=$3;';
    const res = await this.client.query(queryText, [userID, name, year]);
    return res.rows;
  }

  async updateWatchList(name, year, rating, userID) {
    const queryText =
      'UPDATE watchedList SET rating = $1 WHERE userID =$2 AND name=$3 AND year::text=$4;';
    const res = await this.client.query(queryText, [rating, userID, name, year]);
    return res.rows;
  }

  async readWatchList(userID) {
    const queryText =
      'SELECT * FROM watchedList WHERE userID = $1;';
    const res = await this.client.query(queryText, [userID]);
    return res.rows;
  }

  //Handling Wish List
  async addWishList(name, year, userID) {
    const queryText =
      'INSERT INTO wishList (name, year, userID) VALUES ($1, $2, $3) RETURNING *';
    const res = await this.client.query(queryText, [name, year, userID]);
    return res.rows;
  }

  async delWishList(name, year, userID) {
    const queryText =
      'DELETE FROM wishList WHERE name=$1 AND userID = $2 AND year::text=$3;';
    const res = await this.client.query(queryText, [name, userID, year]);
    return res.rows;
  }

  async readWishList(userID) {
    const queryText =
      'SELECT * FROM wishList WHERE userID = $1;';
    const res = await this.client.query(queryText, [userID]);
    return res.rows;
  }
  
}
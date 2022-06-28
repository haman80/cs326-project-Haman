import { Database } from './database.js';
import express from 'express';
import logger from 'morgan';

// Set up the database
const dburl = process.env.DATABASE_URL;
const database = new Database(dburl);
await database.connect();
// Create an Express app.
const app = express();
const port = process.env.PORT || 3000;

// Add middleware to the Express app.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/', express.static('client'));

//Handling the Watched List
// Implement the /addWatched endpoint
app.post('/addWatched', async (req, res) => {
  const my_data = req.body;
  await database.addWatchList(my_data.name, my_data.year, my_data.rating);
  res.status(200).json({"status": "success"});
});

// Implement the /deleteWatched endpoint
app.delete('/deleteWatched', async (req, res) => {
    const my_data = req.body;
    await database.delWatchList(my_data.name, my_data.year);
    res.status(200).json({"status": "success"});
});

// Implement the /updateWatched endpoint
app.post('/updateWatched', async (req, res) => {
  const my_data = req.body;
  await database.updateWatchList(my_data.name, my_data.year, my_data.rating);
  res.status(200).json({"status": "success"});
});

//Handling the Wish List
// Implement the /addWish endpoint
app.post('/addWish', async (req, res) => {
    const my_data = req.body;
    await database.addWishList(my_data.name, my_data.year);
    res.status(200).json({"status": "success"});
  });
  
// Implement the /deleteWish endpoint
app.delete('/deleteWish', async (req, res) => {
    const my_data = req.body;
    await database.delWishList(my_data.name, my_data.year);
    res.status(200).json({"status": "success"});
});

//Handling the recommend list
// Implement the /recom endpoint
app.get('/recom', async (req, res) => {
    res.status(200);
});


// EVERYTHING BELOW THIS WILL WORK AFTER YOU IMPLEMENT THE ABOVE

// This matches all routes that are not defined.
app.all('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

// Start the server.
app.listen(port, () => {
  console.log('Server started.');
});

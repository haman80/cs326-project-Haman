import { Database } from './database.js';
import express from 'express';
import expressSession from 'express-session';
import logger from 'morgan';
import 'dotenv/config';
import users from './users.js';
import auth from './auth.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Set up the database
const dburl = process.env.DATABASE_URL;
const database = new Database(dburl);
await database.connect();
let currentUser = '';

// We will use __dirname later on to send files back to the client.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

// Create an Express app.
const app = express();
const port = process.env.PORT || 3000;

// Session configuration
const sessionConfig = {
  // set this encryption key in Heroku config (never in GitHub)!
  secret: process.env.SECRET || 'SECRET',
  resave: false,
  saveUninitialized: false,
};

// Add middleware to the Express app.
app.use(expressSession(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use('/',express.static('client/login'));

// Configure our authentication strategy
auth.configure(app);

//Handling login information 
// Our own middleware to check if the user is authenticated
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // If we are authenticated, run the next route.
    next();
  } else {
    // Otherwise, redirect to the login page.
    res.redirect('/login');
  }
}

app.use('/private/homepage', checkLoggedIn)
app.use('/private/homepage',express.static('client'));

app.get('/', checkLoggedIn, (req, res) => {
  res.redirect('/private/:userID/');
});

// Handle the URL /login (just output the login.html file).
app.get('/login', (req, res) =>{
  res.sendFile('client/login/login.html', { root: __dirname });
}
  
);

// Handle post data from the login.html form.
app.post(
  '/login',
  auth.authenticate('local', {
    // use username/password authentication
    successRedirect: '/private', // when we login, go to /private
    failureRedirect: '/login', // otherwise, back to login
  })
);

// Handle logging out (takes us back to the login page).
app.get('/logout', async (req, res) => {
  currentUser = '';
  req.logout(); // Logs us out!
  res.redirect('/login'); // back to login
});

// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.addUser(username, password)) {
    res.redirect('/login');
  } else {
    res.redirect('/register');
  }
});

// Register URL
app.get('/register', (req, res) =>
  res.sendFile('client/register.html', { root: __dirname })
);

// Private data
app.get(
  '/private',
  checkLoggedIn, // If we are logged in (notice the comma!)...
  async (req, res) => {
    // Go to the user's page.
    res.redirect('/private/' + req.user);
  }
);


// A dummy page for the user.
app.get(
  '/private/:userID/',
  checkLoggedIn, // We also protect this route: authenticated...
  async (req, res) => {
    // Verify this is the right user.
    if (req.params.userID === req.user) {
      currentUser = req.user;
      res.redirect('/private/homepage/');
    } else {
      res.redirect('/private/');
    }
  }
);


app.get('/getUser', async (req, res) => {
  res.status(200).json(currentUser);
});

//Handling the Watched List
// Implement the /addWatched endpoint
app.post('/addWatched', async (req, res) => {
  const my_data = req.body;
  await database.addWatchList(my_data.name, my_data.year, my_data.rating, my_data.userID);
  res.status(200).json({"status": "success"});
});

// Implement the /deleteWatched endpoint
app.delete('/deleteWatched', async (req, res) => {
    const my_data = req.body;
    await database.delWatchList(my_data.name, my_data.year, my_data.userID);
    res.status(200).json({"status": "success"});
});

// Implement the /updateWatched endpoint
app.post('/updateWatched', async (req, res) => {
  const my_data = req.body;
  await database.updateWatchList(my_data.name, my_data.year, my_data.rating, my_data.userID);
  res.status(200).json({"status": "success"});
});

// Implement the /readWatched endpoint
app.get('/readWatched', async (req, res) => {
  const my_data = await database.readWatchList(currentUser);
  res.status(200).json(my_data);
});

//Handling the Wish List
// Implement the /addWish endpoint
app.post('/addWish', async (req, res) => {
    const my_data = req.body;
    await database.addWishList(my_data.name, my_data.year, my_data.userID);
    res.status(200).json({"status": "success"});
  });
  
// Implement the /deleteWish endpoint
app.delete('/deleteWish', async (req, res) => {
    const my_data = req.body;
    await database.delWishList(my_data.name, my_data.year, my_data.userID);
    res.status(200).json({"status": "success"});
});

// Implement the /readWish endpoint
app.get('/readWish', async (req, res) => {
  const my_data = await database.readWishList(currentUser);
  res.status(200).json(my_data);
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

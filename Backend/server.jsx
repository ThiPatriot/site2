const https = require('https');
const cors = require('cors');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const axios = require('axios'); // HTTP Client
const generateRandomState = require('./crypto.js');

const app = express();

  



const corsOptions = {
  origin: 'https://localhost:5173',
  // other options
};

app.use(cors(corsOptions));

app.use(
  session({
    secret: '0000', // Change this to a more secure secret
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/', (req, res) => {
  res.send('Welcome to the server!'); 
});


app.get('/start-oauth', (req, res) => {
  const state = generateRandomState();
  req.session.oauthState = state; // Store state in the user's session
  const authorizationUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=_KNVBgxSVWsyOTavDuih4dA5M17WvGnU-sHiaym-qqaRDBK1wHIu7CZxBD0FYMWi&redirect_uri=https://localhost:3001/&scope=identity campaigns.members&state=${state}`;
  res.redirect(authorizationUrl); // Redirect user to Patreon for authorization
  console.log('Request received');
}); 

app.get('/oauth-callback', async (req, res) => {
  const receivedState = req.query.state; // Retrieve state from callback URL parameters
  const storedState = req.session.oauthState; // Retrieve state from the user's session

  if (receivedState !== storedState) {
    res.status(400).send('Invalid OAuth state');
    return;
  }

  try {
    // Exchange code for access token from Patreon
    // Use axios or another HTTP client to make requests to Patreon's API
    const patreonResponse = await axios.post('https://www.patreon.com/api/oauth2/token', {
      grant_type: 'authorization_code',
      code: req.query.code,
      client_id: '_KNVBgxSVWsyOTavDuih4dA5M17WvGnU-sHiaym-qqaRDBK1wHIu7CZxBD0FYMWi',
      client_secret: 'IjDNhuaqh-xxBtBotIQ04Ds78LU4R_2Jok935XH38KICbsTsJosL5JLh0gThEZl_', // Replace with your client secret
      redirect_uri: 'http://localhost:3001/', // Replace with your redirect URI
    });

    // Extract the access token from the Patreon response
    const accessToken = patreonResponse.data.access_token;

    // Fetch data from Patreon's API using the obtained access token
    const patreonData = await axios.get('https://www.patreon.com/api/oauth2/v2/identity', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Send fetched data as a response to your frontend
    res.send(patreonData.data);
  } catch (error) {
    res.status(500).send('Error completing OAuth flow');
  }
});

const options = {
  key: fs.readFileSync('../cert/localhost-key.pem'),
  cert: fs.readFileSync('../cert/localhost.pem'),
};

https.createServer(options, app).listen(3001, () => {
  console.log('Server running on https://localhost:3001/');
});

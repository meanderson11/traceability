require('dotenv').config();

const { PORT, NODE_ENV } = process.env;

const path = require('path');
const express = require('express');
const cors = require('cors');

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
    accessToken: '10d545fab2e740a1a8dd7f7436ec309c',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const app = express();
app.use(express.json());
app.use(cors());

app.use('/assets', express.static(path.join(__dirname, '../client/assets')))
app.get("/Hello", (req, res) => {
    try {
        world();
      } catch (error) {
        rollbar.error(error, req);
      }
    });

app.use(rollbar.errorHandler());

app.get('*', (req, res) => {
  const htmlFilePath = path.resolve(__dirname, '..', 'client', 'index.html');

  res.sendFile(htmlFilePath);
});


app.listen(PORT, () => {
  if (NODE_ENV === 'development') {
    console.log(`Server running on http://localhost:${PORT}/`);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});
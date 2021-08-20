const express = require('express');
require('dotenv/config');

const app = express();
const api = process.env.API_URL;

app.get('/', (req, res) => {
  res.send('Server is Running 🚀🚀🚀👨‍🎤👨‍🎤');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(api)
  console.log(`Listening on port ${port}`);
});

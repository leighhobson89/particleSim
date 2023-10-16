const express = require('express');
const app = express();
const path = require('path');

// Serve default favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'default-favicon.ico'));
});

// Serve static files from the root directory (same as app.js)
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

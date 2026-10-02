require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const shortened = new Map();
let counter = 0;

function isValidUrl(value) {
  return new Promise(function(resolve) {
    let parsed;

    try {
      parsed = new URL(value);
    } catch (err) {
      resolve(false);
      return;
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      resolve(false);
      return;
    }

    dns.lookup(parsed.hostname, function(err) {
      resolve(!err);
    });
  });
}

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;

  isValidUrl(url).then(function(valid) {
    if (!valid) {
      res.json({ error: 'invalid url' });
      return;
    }

    counter += 1;
    shortened.set(counter, url);

    res.json({ original_url: url, short_url: counter });
  });
});

app.get('/api/shorturl/:id', function(req, res) {
  const original = shortened.get(Number(req.params.id));

  if (!original) {
    res.status(404).json({ error: 'not found' });
    return;
  }

  res.redirect(302, original);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
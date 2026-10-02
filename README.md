# URL Shortener Microservice

A microservice that stores submitted URLs behind short numeric ids and redirects visitors
to the original address.

Built for the freeCodeCamp project *URL Shortener Microservice*.

## Setup

```bash
npm install
npm start
```

The server listens on port `3000` (override with `PORT=xxxx npm start`). Open
<http://localhost:3000> to use the form.

## API

### POST `/api/shorturl`

Send the URL as an `application/x-www-form-urlencoded` field named `url`:

```bash
curl -X POST localhost:3000/api/shorturl \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'url=https://www.freecodecamp.org/'
```

```json
{ "original_url": "https://www.freecodecamp.org/", "short_url": 1 }
```

An unusable URL responds `200` with `{ "error": "invalid url" }`.

### GET `/api/shorturl/:short_url`

Redirects (302) to the stored URL. An unknown id returns `404`.

```bash
curl -i localhost:3000/api/shorturl/1
```

## How validation works

`isValidUrl` rejects a submission unless it parses as a URL, uses the `http:` or `https:`
scheme, and its hostname resolves via `dns.lookup`. That last step is why
`ftp:/john-doe.invalidTLD` is rejected — it parses fine, but the scheme is not HTTP and
the host does not resolve.

`express.urlencoded` parses the request body, which is what makes the form POST work.
Query strings are stored verbatim, so `http://localhost:3000/?v=1` round-trips
unchanged.

## Storage

Shortened URLs live in a `Map` in process memory with a counter for the next id, so
restarting the server clears everything. Swapping in a database means replacing the
`shortened` map and the counter increment; the route handlers do not change.

## Frontend

The boilerplate form is kept working as a plain POST, and `public/script.js` enhances it
to render the short URL as a clickable link that redirects to the original.
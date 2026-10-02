var form = document.querySelector('form[action="api/shorturl"]');
var input = document.getElementById('url_input');

var result = document.createElement('p');
result.id = 'result';
form.querySelector('fieldset').appendChild(result);

form.addEventListener('submit', function (event) {
  event.preventDefault();

  var url = input.value.trim();

  if (!url) {
    result.textContent = 'Enter a URL first.';
    return;
  }

  fetch('/api/shorturl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'url=' + encodeURIComponent(url),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.error) {
        result.textContent = data.error;
        return;
      }

      var shortUrl = window.location.origin + '/api/shorturl/' + data.short_url;
      result.textContent = '';

      var link = document.createElement('a');
      link.href = shortUrl;
      link.textContent = shortUrl;
      result.appendChild(link);

      var original = document.createElement('span');
      original.textContent = ' → ' + data.original_url;
      result.appendChild(original);
    })
    .catch(function (error) {
      result.textContent = 'Request failed: ' + error.message;
    });
});
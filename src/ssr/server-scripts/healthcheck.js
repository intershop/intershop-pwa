const http = require('http');

checkPort(Number(process.env.PORT) || 4200)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

function checkPort(port) {
  return new Promise((resolve, reject) => {
    const request = http.get({ host: 'localhost', port, timeout: 5000 }, response => {
      response.resume();
      response.statusCode === 200
        ? resolve()
        : reject(new Error(`Storefront on port ${port} returned HTTP ${response.statusCode}`));
    });
    request.on('error', reject);
    request.on('timeout', () => request.destroy(new Error(`Storefront on port ${port} timed out`)));
  });
}

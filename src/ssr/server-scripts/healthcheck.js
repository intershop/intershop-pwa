const http = require('http');

let ports = require('./ecosystem-ports.json');

if (process.env.ACTIVE_THEMES) {
  const activeThemes = process.env.ACTIVE_THEMES.split(',').map(theme => theme.trim());
  ports = Object.fromEntries(Object.entries(ports).filter(([theme]) => activeThemes.includes(theme)));
}

const portsToCheck =
  Object.keys(ports).length > 1
    ? [Number(process.env.PORT) || 4200, ...Object.values(ports)]
    : [Number(process.env.PORT) || 4200];

Promise.all(portsToCheck.map(checkPort))
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

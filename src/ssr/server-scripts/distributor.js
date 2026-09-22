const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
const distFolder = path.join(process.cwd(), 'dist');
let ports = require('./ecosystem-ports.json');

if (process.env.ACTIVE_THEMES) {
  const activeThemes = process.env.ACTIVE_THEMES.split(',').map(theme => theme.trim());
  ports = Object.fromEntries(Object.entries(ports).filter(([theme]) => activeThemes.includes(theme)));
}

// Disable Express x-powered-by header for security reasons
app.disable('x-powered-by');

const deployUrl = getDeployURLFromEnv();
const concurrencySSR = getConcurrencySSR();

app.use((req, res, next) => {
  if (req.path === '/PURGE_CACHE_ICM_CALLS' && req.method === 'PURGE') {
    const purgeRequests = [];
    for (let worker = 0; worker < concurrencySSR; worker++) {
      Object.values(ports).forEach(port => purgeRequests.push(forwardPurgeRequest(req, port)));
    }

    Promise.all(purgeRequests)
      .then(() => res.status(200).send('PURGE requests proxied successfully'))
      .catch(error => res.status(500).send(`Error proxying PURGE request: ${error}`));
    return;
  }

  const theme = getRequestTheme(req);
  const port = ports[theme] || Object.values(ports)[0];
  return proxy(`localhost:${port}`, { preserveHostHdr: true })(req, res, next);
});

app.listen(Number(process.env.PORT) || 4200, () => {
  console.log('Multi-theme PWA distributor listening');
});

function getRequestTheme(req) {
  const requestedTheme = /(?:^|[;?&])theme=([\w-]+)/.exec(req.originalUrl)?.[1];
  if (requestedTheme && ports[requestedTheme]) {
    return requestedTheme;
  }

  const assetTheme = Object.keys(ports).find(theme => {
    const requestPath = req.path.slice(!deployUrl.startsWith('http') ? deployUrl.length : 0).replace(/[;?&].*$/, '');
    return fs.existsSync(path.join(distFolder, theme, 'browser', requestPath));
  });

  return assetTheme || (ports[process.env.THEME] ? process.env.THEME : undefined);
}

function forwardPurgeRequest(req, port) {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        headers: req.headers,
        host: 'localhost',
        method: 'PURGE',
        path: req.originalUrl,
        port,
      },
      response => {
        response.resume();
        response.statusCode >= 200 && response.statusCode < 300
          ? resolve()
          : reject(new Error(`SSR process on port ${port} returned ${response.statusCode}`));
      }
    );
    request.on('error', reject);
    request.end();
  });
}

function getConcurrencySSR() {
  const env = process.env.CONCURRENCY_SSR;
  const cpuCount = os.cpus().length;

  if (!env) return 2;
  if (env === 'max' || env === '0') return cpuCount;

  const parsed = parseInt(env, 10);
  if (isNaN(parsed)) return 2;
  if (parsed > 0) return parsed;
  if (parsed < 0) return Math.max(1, cpuCount + parsed);

  return 2;
}

// copy from deploy-url.ts
function getDeployURLFromEnv() {
  const envDeployUrl = process.env.DEPLOY_URL || '/';

  return `${envDeployUrl}${envDeployUrl.endsWith('/') ? '' : '/'}`;
}

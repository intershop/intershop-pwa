const fs = require('fs');
const path = require('path');
const os = require('os');
const ports = require('./ecosystem-ports.json');

const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

const concurrencySSR = getConcurrencySSR();

app.use((req, res, next) => {
  let match = /theme=(\w+)/.exec(req.originalUrl)?.[1];

  if (!match) {
    match = Object.keys(ports).find(config => {
      const p = path.join(
        process.cwd(),
        'dist',
        config,
        'browser',
        req.path.slice(process.env.DEPLOY_URL.length).replace(/[;?&].*$/, '')
      );
      return fs.existsSync(p);
    });
  }

  if (!match && Object.keys(ports).includes(process.env.THEME)) {
    match = process.env.THEME;
  }

  const fwPort = ports[match] || 4000;

  if ('/PURGE_CACHE_ICM_CALLS' === req.path && req.method === 'PURGE') {
    const purgePromises = [];
    for (let i = 0; i < concurrencySSR; i++) {
      purgePromises.push(
        ...Object.values(ports).map(port =>
          proxy('localhost:' + port, { preserveHostHdr: true })(req, res, () => Promise.resolve())
        )
      );
    }

    Promise.all(purgePromises)
      .then(() => res.status(200).send('PURGE requests proxied sucessfully'))
      .catch(err => res.status(500).send('Error proxying PURGE request: ' + err));
    return;
  }
  return proxy('localhost:' + fwPort, { preserveHostHdr: true })(req, res, next);
});

app.listen(+process.env.PORT || 4200, () => {
  console.log('multi PWA proxy listening');
});

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

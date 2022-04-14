const fs = require('fs');
const path = require('path');
const ports = require('./ecosystem-ports.json');

const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

app.use((req, res, next) => {
  let match = /theme=(\w+)/.exec(req.originalUrl)?.[1];

  if (!match) {
    match = Object.keys(ports).find(config => {
      const p = path.join(process.cwd(), 'dist', config, 'browser', req.path.substring(1).replace(/[;?&].*$/, ''));
      return fs.existsSync(p);
    });
  }

  if (!match && Object.keys(ports).includes(process.env.THEME)) {
    match = process.env.THEME;
  }

  const fwPort = ports[match] || 4000;

  return proxy('localhost:' + fwPort, { preserveHostHdr: true })(req, res, next);
});

app.listen(+process.env.PORT || 4200, () => {
  console.log('multi PWA proxy listening');
});

/**
 * Local ICM Cache
 *
 * Proxy tool for caching ICM responses
 *
 * Set environment variable ICM_BASE_URL directed to an ICM installation when starting the tool.
 * Set ICM_BASE_URL of your PWA to http://localhost:10000.
 */

const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

const cacher = new (require('cacher'))();
app.use(cacher.cache('minutes', 10));

// override cache TTL based on response
cacher.genCacheTtl = function (res, original) {
  if (res.statusCode === 404) {
    return 60 * 60; // 60 minutes
  } else if (res.statusCode >= 500) {
    return 0; // do not cache server or connection errors
  }
  return original;
};

const logging = /on|1|true|yes/.test(process.env.LOGGING?.toLowerCase());

if (logging) {
  cacher.on('miss', key => {
    console.log('MISS', key);
  });
  cacher.on('hit', key => {
    console.log('HIT', key);
  });
}

app.use(
  proxy(process.env.ICM_BASE_URL, {
    timeout: 0,
  })
);

app.listen(10000, () => {
  console.log('ICM cache listening');
});

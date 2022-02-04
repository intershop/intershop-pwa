/**
 * Local ICM Cache
 *
 * Proxy tool for caching ICM responses
 * Required dependency https://github.com/addisonj/node-cacher
 *
 *
 * FOR TESTING
 *
 * To run the PWA with this local caching set the ICM_BASE_URL of your PWA to "http://localhost:10000".
 * - in one shell run: ICM_BASE_URL=http://localhost:10000 npm run start
 * Set environment variable ICM_BASE_URL directed to an ICM installation when starting the cache tool.
 * - in a second shell run: ICM_BASE_URL=<ICM> node scripts/icm-cache.js
 *
 *
 * FOR INTEGRATION
 *
 * Move the 'icm-cache.js' file to the 'src/ssr/server-scripts' folder and install the dependency.
 *
 * An environment variable LOCAL_ICM_CACHE could be used to enable/disable caching ICM responses in a deployed SSR container.
 * The following code snippets to integrate the local ICM cache could be used.
 *
 * Code snippet to adapt the 'build-ecosystem.js':
-----
const LOCAL_ICM_CACHE = /^(on|1|true|yes)$/i.test(process.env.LOCAL_ICM_CACHE);
const localICMCacheActive = LOCAL_ICM_CACHE && !!process.env.ICM_BASE_URL;
if (LOCAL_ICM_CACHE && !process.env.ICM_BASE_URL) {
  console.warn('LOCAL_ICM_CACHE cannot be used without setting ICM_BASE_URL');
}
if (localICMCacheActive) {
  content += `
  - script: dist/icm-cache.js
    name: icm-cache
    time: true
`;
}
-----
 *
 * Code snippet to adapt the 'Object.entries(ports).forEach(([theme, port])' part of 'build-ecosystem.js':
-----
if (localICMCacheActive) {
  content += `      ICM_BASE_URL_SSR: http://localhost:10000
    `;
}
-----
 *
 * Code snippet to adapt 'src\app\core\store\core\configuration\configuration.selectors.ts':
-----
const ssrBaseUrl = typeof process !== 'undefined' && process.env.ICM_BASE_URL_SSR;

export const getICMServerURL = createSelector(getConfigurationState, state =>
  state.baseURL && state.server ? `${ssrBaseUrl || state.baseURL}/${state.server}` : undefined
);
-----
 *
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

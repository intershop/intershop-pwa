// https://docs.docker.com/engine/reference/builder/#healthcheck

const { performance } = require('perf_hooks');

if (!process.env['MAX_RESPONSE_TIME']) {
  console.log(`no explicit MAX_RESPONSE_TIME set -- skipping healthcheck`);
  process.exit(0);
}

if (process.env.TRUST_ICM) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const pwaClient = process.env.SSL ? require('https') : require('http')

const optionsAngularUniversal = {
  host: 'localhost',
  port: process.env.PORT || '4200',
  timeout: 2000,
};

const errFunc = function(err) {
  console.log(`ERROR ${JSON.stringify(err)}`);
  process.exit(1);
};

const startTime = performance.now();
const requestAngularUniversal = pwaClient.request(optionsAngularUniversal, res => {
  const endTime = performance.now();
  const responseTime = endTime - startTime
  console.log(`STATUS STOREFRONT: ${res.statusCode} RESPONSE TIME: ${responseTime}`);
  if (res.statusCode == 200 && responseTime < process.env['MAX_RESPONSE_TIME']) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});
requestAngularUniversal.on('error', errFunc);

requestAngularUniversal.end();

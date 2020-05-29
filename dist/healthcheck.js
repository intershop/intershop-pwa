// https://docs.docker.com/engine/reference/builder/#healthcheck

if (!process.env['ICM_BASE_URL']) {
  console.log(`no explicit ICM_BASE_URL set -- skipping healthcheck`);
  process.exit(0);
}

if (process.env.TRUST_ICM) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const [icmProtocol, icmBase] = process.env['ICM_BASE_URL'].split('://');
let [, icmHost, icmPort] = /^(.*?):?([0-9]+)?$/.exec(icmBase);
icmPort = icmPort || (icmProtocol === 'http' ? '80' : '443');

const icmClient = require(icmProtocol);
const pwaClient = process.env.SSL ? require('https') : require('http')

const optionsICMRest = {
  host: icmHost,
  port: icmPort,
  path: '/INTERSHOP',
  timeout: 10000,
};

const optionsAngularUniversal = {
  host: 'localhost',
  port: process.env.PORT || '4200',
  timeout: 2000,
};

const errFunc = function(err) {
  console.log(`ERROR ${JSON.stringify(err)}`);
  process.exit(1);
};

console.log(`checking for ICM on ${icmProtocol}://${icmHost}:${icmPort}`);
const requestICMRest = icmClient.request(optionsICMRest, res => {
  console.log(`STATUS ICM REST: ${res.statusCode === 404 ? 'OK' : res.statusMessage}`);
  if (res.statusCode == 404) {
    const requestAngularUniversal = pwaClient.request(optionsAngularUniversal, res => {
      console.log(`STATUS STOREFRONT: ${res.statusCode} ${res.statusMessage}`);
      if (res.statusCode == 200) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    });
    requestAngularUniversal.on('error', errFunc);

    requestAngularUniversal.end();
  } else {
    process.exit(1);
  }
});

requestICMRest.on('error', errFunc);

requestICMRest.end();

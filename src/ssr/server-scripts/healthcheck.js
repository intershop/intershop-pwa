// https://docs.docker.com/engine/reference/builder/#healthcheck

if (!process.env['ICM_BASE_URL']) {
  console.log(`no explicit ICM_BASE_URL set -- skipping healthcheck`);
  process.exit(0);
}

if (process.env.TRUST_ICM) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const pwaClient = require('http');

const optionsAngularUniversal = {
  host: 'localhost',
  timeout: 2000,
};

const errFunc = function (err) {
  console.log(`ERROR ${JSON.stringify(err)}`);
  process.exit(1);
};

let ports = require('./ecosystem-ports.json');

if (process.env.ACTIVE_THEMES) {
  const active = process.env.ACTIVE_THEMES.split(',');
  ports = Object.entries(ports)
    .filter(([theme]) => active.includes(theme))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

const portsToCheck = [process.env.PORT || 4200];
if (Object.keys(ports).length > 1) {
  portsToCheck.push(...Object.values(ports));
}

portsToCheck.forEach(port => {
  const requestAngularUniversal = pwaClient.request({ ...optionsAngularUniversal, port }, res => {
    console.log(`STATUS STOREFRONT (${port}): ${res.statusCode} ${res.statusMessage}`);
    if (res.statusCode !== 200) {
      process.exit(1);
    }
  });
  requestAngularUniversal.on('error', errFunc);

  requestAngularUniversal.end();
});

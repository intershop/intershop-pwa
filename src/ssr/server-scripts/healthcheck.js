// https://docs.docker.com/engine/reference/builder/#healthcheck

const pwaClient = require('http');

const optionsAngularSSR = {
  host: 'localhost',
  timeout: 2000,
};

const errFunc = function (err) {
  console.log(`ERROR ${JSON.stringify(err)}`);
  process.exit(1);
};

const port = process.env.PORT || 4200;

const requestAngularSSR = pwaClient.request({ ...optionsAngularSSR, port }, res => {
  console.log(`STATUS STOREFRONT (${port}): ${res.statusCode} ${res.statusMessage}`);
  if (res.statusCode !== 200) {
    process.exit(1);
  }
});
requestAngularSSR.on('error', errFunc);
requestAngularSSR.end();

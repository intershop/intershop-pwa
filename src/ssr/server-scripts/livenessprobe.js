// Kubernetes liveness probe - checks if the SSR process is responsive

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

const req = pwaClient.request({ ...optionsAngularSSR, port }, () => {
  process.exit(0);
});
req.on('error', errFunc);
req.end();

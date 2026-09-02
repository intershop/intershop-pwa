// Kubernetes readiness probe - checks if the SSR process is ready to serve traffic

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

const req = pwaClient.request({ ...optionsAngularSSR, port }, res => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});
req.on('error', errFunc);
req.end();

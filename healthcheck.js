var http = require("http");

const icmBase = process.env['ICM_BASE_URL'].split('//')[1];
const icmHost = icmBase.split(':')[0];
const icmPort = icmBase.split(':')[1];

var optionsICMRest = {
  host : icmHost,
  port : icmPort,
  path : "/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-;loc=en_US;cur=USD/categories",
  timeout : 10000
};
var optionsAngularUniversal = {
  host : "localhost",
  port : "4200",
  timeout : 2000
};

var errFunc = function(err) {
  console.log(`ERROR ${JSON.stringify(err)}`);
  process.exit(1);
};

console.log(`checking for ICM on ${icmHost}:${icmPort}`)
var requestICMRest = http.request(optionsICMRest, (res) => {
  console.log(`STATUS ICM REST: ${res.statusCode} ${res.statusMessage}`);
  if (res.statusCode == 200) {
    requestAngularUniversal = http.request(optionsAngularUniversal, (res) => {
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

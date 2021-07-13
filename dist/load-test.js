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

const icmBasePath = '/INTERSHOP/rest/WFS/';

const optionsICMRest = {
  host: icmHost,
  port: icmPort,
  path: icmBasePath,
  timeout: 10000,
};

const optionsAngularUniversal = {
  host: 'localhost',
  port: process.env.PORT || '4200',
  timeout: 2000,
};

function icmProductsCall(categoryPath) {
  optionsICMRest.path = icmBasePath + categoryPath + '/products?attrs=sku';

  const categoryRequest = icmClient.request(optionsICMRest, (response) => {
    response.setEncoding('utf8')
    let body = [];

    response.on('data', (chunk) => {
      body.push(Buffer.from(chunk));
    });

    response.on('end', () => {
      body = Buffer.concat(body).toString();
      const products = JSON.parse(body);
    });
    response.on('error', console.error)
  });
  categoryRequest.end();
}

function icmCategoryCall(categoryPath) {
  optionsICMRest.path = icmBasePath + categoryPath;

  const categoryRequest = icmClient.request(optionsICMRest, (response) => {
    response.setEncoding('utf8')
    let body = [];

    response.on('data', (chunk) => {
      body.push(Buffer.from(chunk));
    });

    response.on('end', () => {
      body = Buffer.concat(body).toString();
      const category = JSON.parse(body);
      if (category.hasOnlineSubCategories) {
        category.subCategories.forEach(subCategory => {
          icmCategoryCall(subCategory.uri)
        })
      } else {
        icmProductsCall(category.uri);
      }
    });
    response.on('error', console.error)
  });
  categoryRequest.end();
}

let categoryPath = 'inSPIRED-inTRONICS-Site/rest;loc=en_US;cur=USD/categories/Computers';
icmCategoryCall(categoryPath);


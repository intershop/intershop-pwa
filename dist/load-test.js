if (!process.env['ICM_BASE_URL']) {
  console.log(`no explicit ICM_BASE_URL set -- skipping healthcheck`);
  process.exit(0);
}

const args = process.argv?.slice(2);
switch(args[0]) {
  case '-url':
    pwaUrl = args[1] || 'https://pwa-rngrx-int.pwa.intershop.de';
    break;
  default:
    console.log('Use -url to specify the pwa base url.')
    pwaUrl = 'https://pwa-rngrx-int.pwa.intershop.de'
}
console.log(`Using ${pwaUrl}`)

if (process.env.TRUST_ICM) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const [icmProtocol, icmBase] = process.env['ICM_BASE_URL'].split('://');
let [, icmHost, icmPort] = /^(.*?):?([0-9]+)?$/.exec(icmBase);
icmPort = icmPort || (icmProtocol === 'http' ? '80' : '443');

const icmClient = require(icmProtocol);

const icmBasePath = '/INTERSHOP/rest/WFS/';

const optionsICMRest = {
  host: icmHost,
  port: icmPort,
  path: icmBasePath,
  timeout: 10000,
};

const fs = require('fs');
fs.writeFileSync('dist/load-test.txt', '');

function pwaCategoryPageCall(categoryName, categoryRef) {
  const encodedUri = encodeURIComponent(`${categoryName}-cat${categoryRef}`)
  console.log('Requesting CLP or PLP', `${pwaUrl}/${encodedUri}`);
  fs.appendFileSync('dist/load-test.txt', `${pwaUrl}/${encodedUri}\n`);
}

function pwaProductDetailPageCall(categoryName, productName, sku) {
  const encodedCategory = encodeURIComponent(`${categoryName}`)
  const encodedProduct = encodeURIComponent(`${productName}-sku${sku}`)
  console.log('Requesting PDP', `${pwaUrl}/${encodedCategory}/${encodedProduct}`);
  fs.appendFileSync('dist/load-test.txt', `${pwaUrl}/${encodedCategory}/${encodedProduct}\n`);
}

function icmProductsCall(categoryName, categoryPath) {
  optionsICMRest.path = icmBasePath + categoryPath + '/products?attrs=sku';

  const categoryRequest = icmClient.request(optionsICMRest, (response) => {
    response.setEncoding('utf8')
    let body = [];

    response.on('data', (chunk) => {
      body.push(Buffer.from(chunk));
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        body = Buffer.concat(body).toString();
        const products = JSON.parse(body);
        products.elements.forEach(element => pwaProductDetailPageCall(categoryName, element.title, element.attributes[0].value))
      }
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
      if (response.statusCode === 200) {
        body = Buffer.concat(body).toString();
        const category = JSON.parse(body);
        pwaCategoryPageCall(category.name, category.categoryRef);
        if (category.hasOnlineSubCategories) {
          category.subCategories.forEach(subCategory => {
            icmCategoryCall(subCategory.uri)
          })
        } else {
          icmProductsCall(category.name, category.uri);
        }
      }
    });
    response.on('error', console.error)
  });
  categoryRequest.end();
}

const categoryPath = 'inSPIRED-inTRONICS-Site/rest;loc=en_US;cur=USD/categories/Computers';
icmCategoryCall(categoryPath);


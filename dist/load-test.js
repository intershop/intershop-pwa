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
const pwaClient = require('https');

const icmBasePath = '/INTERSHOP/rest/WFS/';

const optionsICMRest = {
  host: icmHost,
  port: icmPort,
  path: icmBasePath,
  timeout: 10000,
};

const optionsAngularUniversal = {
  host: 'pwa-rngrx-int.pwa.intershop.de',
};

const icmAgent = new icmClient.Agent({
  keepAlive: true,
});

optionsICMRest.agent = icmAgent;

const pwaAgent = new pwaClient.Agent({
  keepAlive: true,
  maxSockets: 20,
  timeout: 300,
});

optionsAngularUniversal.agent = pwaAgent;

function pwaCategoryPageCall(categoryName, categoryRef) {
  const encodedUri = encodeURIComponent(`${categoryName}-cat${categoryRef}`)
  optionsAngularUniversal.path = `/${encodedUri}`;
  console.log('Requesting CLP or PLP', optionsAngularUniversal.path);
  const categoryPageRequest = pwaClient.request(optionsAngularUniversal, (response) => {
    console.log('category page', response.statusCode)

    response.on('error', console.error)
  });
  categoryPageRequest.end();
  categoryPageRequest.on('socket', close);
}

function pwaProductDetailPageCall(categoryName, productName, sku) {
  const encodedCategory = encodeURIComponent(`${categoryName}`)
  const encodedProduct = encodeURIComponent(`${productName}-sku${sku}`)
  optionsAngularUniversal.path = `/${encodedCategory}/${encodedProduct}`;
  console.log('Requesting PDP', optionsAngularUniversal.path)
  const categoryPageRequest = pwaClient.request(optionsAngularUniversal, (response) => {
    console.log('productDetail', response.statusCode)

    response.on('error', console.error)
  });
  categoryPageRequest.end();
  categoryPageRequest.on('socket', close);
}

function close(socket) {
  socket.emit('agentRemove');
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


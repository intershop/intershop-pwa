const icmClient = require('https');
const icmBasePath = '/INTERSHOP/rest/WFS/';
const optionsICMRest = {
  host: 'pwa-ish-demo.test.intershop.com',
  port: '443',
  path: icmBasePath,
  timeout: 10000,
};

const fs = require('fs');
fs.writeFileSync('dist/correct-urls.csv', '');

function pwaCategoryPageCall(categoryName, categoryRef) {
  const encodedUri = encodeURIComponent(`${categoryName}-cat${categoryRef}`);
  fs.appendFileSync('dist/correct-urls.csv', `/${encodedUri}\n`);
}

function pwaProductDetailPageCall(categoryName, productName, sku) {
  const encodedCategory = encodeURIComponent(`${categoryName}`);
  const encodedProduct = encodeURIComponent(`${productName}-sku${sku}`);
  fs.appendFileSync('dist/correct-urls.csv', `/${encodedCategory}/${encodedProduct}\n`);
}

function icmProductsCall(categoryName, categoryPath) {
  optionsICMRest.path = icmBasePath + categoryPath + '/products?attrs=sku';

  const categoryRequest = icmClient.request(optionsICMRest, response => {
    response.setEncoding('utf8');
    let body = [];

    response.on('data', chunk => {
      body.push(Buffer.from(chunk));
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        body = Buffer.concat(body).toString();
        const products = JSON.parse(body);
        products.elements.forEach(element =>
          pwaProductDetailPageCall(categoryName, element.title, element.attributes[0].value)
        );
      }
    });
    response.on('error', console.error);
  });
  categoryRequest.end();
}

function icmCategoryCall(categoryPath) {
  optionsICMRest.path = icmBasePath + categoryPath;

  const categoryRequest = icmClient.request(optionsICMRest, response => {
    response.setEncoding('utf8');
    let body = [];

    response.on('data', chunk => {
      body.push(Buffer.from(chunk));
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        body = Buffer.concat(body).toString();
        const category = JSON.parse(body);
        pwaCategoryPageCall(category.name, category.categoryRef);
        if (category.hasOnlineSubCategories) {
          category.subCategories.forEach(subCategory => {
            icmCategoryCall(subCategory.uri);
          });
        } else {
          icmProductsCall(category.name, category.uri);
        }
      }
    });
    response.on('error', console.error);
  });
  categoryRequest.end();
}

const categoryPath = 'inSPIRED-inTRONICS-Site/rest;loc=en_US;cur=USD/categories';
icmCategoryCall(`${categoryPath}/Cameras`);
icmCategoryCall(`${categoryPath}/Computers`);
icmCategoryCall(`${categoryPath}/Home-Entertainment`);
icmCategoryCall(`${categoryPath}/Specials`);

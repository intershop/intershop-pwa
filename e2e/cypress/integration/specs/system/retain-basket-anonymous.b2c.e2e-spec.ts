import { at, waitLoadingEnd } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  product: {
    sku: '201807171',
    price: 185.5,
  },
};

describe('Returning User with Basket', () => {
  describe('anonymous user', () => {
    it('should add product to basket', () => {
      ProductDetailPage.navigateTo(_.product.sku);
      at(ProductDetailPage, page => {
        page.addProductToCart().its('response.statusCode').should('equal', 201);
        page.header.miniCart.total.should('contain', _.product.price);
        waitLoadingEnd(1000);
      });
    });

    it('should refresh page and still have basket', () => {
      HomePage.navigateTo();
      at(HomePage, page => page.header.miniCart.total.should('contain', _.product.price));
    });
  });
});

import { at } from '../../framework';
import { CartPage } from '../../pages/checkout/cart.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  bundleSKU: '201807194',
  bundleParts: ['201807191', '201807192', '201807193'],
};

describe('Shopping User', () => {
  before(() => ProductDetailPage.navigateTo(_.bundleSKU));

  it('starting at product detail page of a bundle', () => {
    at(ProductDetailPage, page => {
      page.sku.should('have.text', _.bundleSKU);
      page.bundleParts.visibleProductSKUs.should('deep.equal', _.bundleParts);
    });
  });

  it('adding bundle to cart', () => {
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      page.header.miniCart.goToCart();
    });
  });

  it('should see the product bundle as single item in cart', () => {
    at(CartPage, page => {
      page.lineItems.should('have.length', 1);
      page.lineItem(0).sku.should('contain', _.bundleSKU);
    });
  });
});

import { at } from '../../framework';
import { CartPage } from '../../pages/checkout/cart.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  retailSetSKU: '201807198',
  retailSetParts: ['201807195', '201807197', '201807196', '201807199'],
};

describe('Shopping User', () => {
  before(() => ProductDetailPage.navigateTo(_.retailSetSKU));

  it('starting at product detail page of a retail set', () => {
    at(ProductDetailPage, page => {
      page.sku.should('have.text', _.retailSetSKU);
      page.retailSetParts.visibleProductSKUs.should('deep.equal', _.retailSetParts);
    });
  });

  it('adding retail set to cart', () => {
    at(ProductDetailPage, page => {
      page.addProductToCart();
      cy.wait(2000);
      page.header.miniCart.goToCart();
    });
  });

  it('should see the product retail set as multiple items in cart', () => {
    at(CartPage, page => {
      page.lineItems.should('have.length', 4);
      for (let idx = 0; idx < _.retailSetParts.length; idx++) {
        page.lineItem(idx).sku.should('contain', _.retailSetParts[idx]);
      }
    });
  });
});

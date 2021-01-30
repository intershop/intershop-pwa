import { at } from '../../framework';
import { CartPage } from '../../pages/checkout/cart.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  retailSetSKU: '201807198',
  retailSetParts: [
    { sku: '201807195', quantity: 1 },
    { sku: '201807197', quantity: 0 },
    { sku: '201807196', quantity: 1 },
    { sku: '201807199', quantity: 3 },
  ],
};

describe('Shopping User', () => {
  before(() => ProductDetailPage.navigateTo(_.retailSetSKU));

  it('starting at product detail page of a retail set', () => {
    at(ProductDetailPage, page => {
      page.sku.should('have.text', _.retailSetSKU);
      page.retailSetParts.visibleProductSKUs.should(
        'deep.equal',
        _.retailSetParts.map(e => e.sku)
      );
    });
  });

  it('adding retail set to cart', () => {
    at(ProductDetailPage, page => {
      _.retailSetParts.forEach(part => {
        page.retailSetParts.setProductTileQuantity(part.sku, part.quantity);
      });
      page.addProductToCart();
      cy.wait(2000);
      page.header.miniCart.goToCart();
    });
  });

  it('should see the product retail set as multiple items in cart', () => {
    at(CartPage, page => {
      const parts = _.retailSetParts.filter(p => !!p.quantity);
      page.lineItems.should('have.length', parts.length);

      let idx = 0;
      parts.forEach(part => {
        page.lineItem(idx).sku.should('contain', part.sku);
        page.lineItem(idx).quantity.get().should('equal', part.quantity);
        idx++;
      });
    });
  });
});

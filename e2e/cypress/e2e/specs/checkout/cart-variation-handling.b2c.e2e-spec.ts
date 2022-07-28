import { at, waitLoadingEnd } from '../../framework';
import { CartPage } from '../../pages/checkout/cart.page';
import { LineItemDialogPage } from '../../pages/checkout/line-item-dialog.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  productSkuInitial: '201807231-01',
  productSkuTarget: '201807231-02',
  selections: [
    {
      attr: '[data-testing-id="Hard_disk_drive_capacity"]',
      value: '512GB',
    },
  ],
};

describe('Variation Handling in Cart', () => {
  before(() => {
    ProductDetailPage.navigateTo(_.productSkuInitial);
  });

  it('user adds one variation-product to basket and switch the variation', () => {
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.lineItems.should('have.length', 1);
      page.lineItem(0).openVariationEditDialog();
    });
    at(LineItemDialogPage, dialog => {
      dialog.changeVariationSelection(_.selections);
      waitLoadingEnd();
      dialog.save();
    });
    at(CartPage, page => {
      page.lineItem(0).sku.should('contain', _.productSkuTarget);
    });
  });
});

import { at, waitLoadingEnd } from '../../framework';
import { CartPage } from '../../pages/checkout/cart.page';
import { HomePage } from '../../pages/home.page';
import { QuickorderPage } from '../../pages/quickorder/quickorder.page';

describe('Quick Order', () => {
  before(() => HomePage.navigateTo());

  it('should follow header link to quickorder page', () => {
    at(HomePage, page => page.header.gotoQuickorder());
    at(QuickorderPage);
  });

  it('should enter SKUs', () => {
    at(QuickorderPage, page => {
      page.fillFormLine(0, '6997041', 20);
      page.fillFormLine(1, '5079807');
      page.fillFormLine(2, '4713147997367', 2);
      page.fillFormLine(3, '9404860');
      page.fillFormLine(4, '7914407', 10);
      page.addLine();
      page.fillFormLine(5, '201807195', 5);
    });
  });

  it('should add all products to cart', () => {
    at(QuickorderPage, page => {
      page.addToCart();
      waitLoadingEnd(1000);
      // number of items + one free gift
      page.header.miniCart.text.should('contain', '40 items');
    });
  });

  it('should direct order validation fail, when sku is wrong', () => {
    at(QuickorderPage, page => {
      page.header.miniCart.goToCart();

      at(CartPage, cartPage => {
        cartPage.validateDirectOrderSku('123');
      });
    });
  });

  it('should add a product via direct order', () => {
    at(CartPage, page => {
      const sku = '5079807';
      const lineItemPosition = 1;
      page.lineItem(lineItemPosition).quantity.get().should('equal', 1);

      page.addProductToBasketWithDirectOrder(sku);
      page.lineItem(lineItemPosition).quantity.get().should('equal', 2);
    });
  });
});

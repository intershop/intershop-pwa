import { at, waitLoadingEnd } from '../../framework';
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
});

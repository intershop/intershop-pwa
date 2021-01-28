import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { QuoteDetailPage } from '../../pages/account/quote-detail.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  product: {
    sku: '6997041',
  },
};

describe('Quote Handling as Anonymous User', () => {
  before(() => {
    createB2BUserViaREST(_.user);
  });

  describe('basket to quote', () => {
    before(() => ProductDetailPage.navigateTo(_.product.sku));

    it('user should press add product to basket and go to basket page and add basket to quote', () => {
      at(ProductDetailPage, page => {
        page.addProductToCart();
        page.header.miniCart.goToCart();
      });
      at(CartPage, page => page.createQuoteRequest());
    });

    it('user should log in and land at basket page', () => {
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.user.password);
        page.submit().its('response.statusCode').should('equal', 200);
      });
      at(CartPage);
    });

    it('user should be able to see quote request', () => {
      at(CartPage, page => page.createQuoteRequest());
      at(QuoteDetailPage, page => {
        page.productId.eq(0).should('contain', _.product.sku);
        page.quoteState.should('have.text', 'New');
      });
    });

    it('user should be able to submit quote request', () => {
      at(QuoteDetailPage, page => {
        page.submitQuoteRequest();
        page.quoteState.should('have.text', 'Submitted');
      });
    });
  });
});

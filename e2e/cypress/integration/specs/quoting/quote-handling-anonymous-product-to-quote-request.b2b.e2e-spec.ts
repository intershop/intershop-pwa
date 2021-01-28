import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';
import { QuoteRequestDialog } from '../../pages/shopping/quote-request.dialog';

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

  describe('product to quote', () => {
    before(() => ProductDetailPage.navigateTo(_.product.sku));

    it('user should press add product to quote and land at login', () => {
      at(ProductDetailPage, page => page.addProductToQuoteRequest());
      at(LoginPage);
    });

    it('user should log in and land at product detail page with open dialog', () => {
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.user.password);
        page.submit().its('response.statusCode').should('equal', 200);
      });
      at(ProductDetailPage, page => page.sku.should('have.text', _.product.sku));
      at(QuoteRequestDialog);
    });

    it('user should be able to submit quote request', () => {
      at(QuoteRequestDialog, dialog => {
        dialog.submitQuoteRequest();
        dialog.productId.eq(0).should('contain', _.product.sku);
        dialog.quoteState.should('have.text', 'Submitted');
        dialog.hide();
      });
    });
  });
});

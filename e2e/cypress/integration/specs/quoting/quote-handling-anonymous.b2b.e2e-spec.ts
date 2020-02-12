import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { QuoteDetailPage } from '../../pages/account/quote-detail.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { HomePage } from '../../pages/home.page';
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

    it('user should log in and land at product detail page', () => {
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.user.password);
        page
          .submit()
          .its('status')
          .should('equal', 200);
      });
      at(ProductDetailPage, page => page.sku.should('have.text', _.product.sku));
    });

    it('user should be able to submit quote request', () => {
      at(ProductDetailPage, page => page.addProductToQuoteRequest());
      at(QuoteRequestDialog, dialog => {
        dialog.submitQuoteRequest();
        dialog.productId.eq(0).should('contain', _.product.sku);
        dialog.quoteState.should('have.text', 'Submitted');
        dialog.hide();
      });
    });

    it('user should log out', () => {
      at(ProductDetailPage, page => page.header.logout());
      at(HomePage);
    });
  });

  describe('basket to quote', () => {
    before(() => ProductDetailPage.navigateTo(_.product.sku));

    it('user should press add product to basket and go to basket page and add basket to quote', () => {
      at(ProductDetailPage, page => {
        page.addProductToCart();
        cy.wait(2000);
        page.header.miniCart.goToCart();
      });
      at(CartPage, page => page.createQuoteRequest());
    });

    it('user should log in and land at basket page', () => {
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.user.password);
        page
          .submit()
          .its('status')
          .should('equal', 200);
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

    it('user should log out', () => {
      at(QuoteDetailPage, page => page.header.logout());
      at(HomePage);
    });
  });
});

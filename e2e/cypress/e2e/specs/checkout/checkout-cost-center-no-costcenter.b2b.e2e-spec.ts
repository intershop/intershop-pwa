import { at } from '../../framework';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  user: {
    login: 'aarbeit@test.intershop.de',
    password: sensibleDefaults.password,
  },
  sku: '201807199',
};

describe('Shopping User B2B', () => {
  it('user with no cost centers should start checkout with no cost center', () => {
    ProductDetailPage.navigateTo(_.sku);
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      cy.wait(1000);
      page.header.gotoLoginPage();
    });
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.costCenterSelection.should('not.exist');
      page.beginCheckout();
    });
    at(CheckoutPaymentPage, page => {
      page.header.logout();
    });
  });
});

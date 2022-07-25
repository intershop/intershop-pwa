import { at } from '../../framework';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  costCenter: '100402',
  user: {
    login: 'jlink@test.intershop.de',
    password: sensibleDefaults.password,
  },
  sku: '201807199',
};

describe('Shopping User B2B', () => {
  it('user with multiple cost centers should start checkout with a selected cost center', () => {
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
      page.costCenterSelection.should('exist');
      page.selectCostCenter(_.costCenter);
      page.beginCheckout();
    });
    at(CheckoutPaymentPage, page => {
      page.header.logout();
    });
  });
});

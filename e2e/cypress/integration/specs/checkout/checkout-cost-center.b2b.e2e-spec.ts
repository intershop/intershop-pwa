import { at } from '../../framework';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { CheckoutReceiptPage } from '../../pages/checkout/checkout-receipt.page';
import { CheckoutReviewPage } from '../../pages/checkout/checkout-review.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  user: {
    loginNoCostCenter: 'aarbeit@test.intershop.de',
    loginSingleCostCenter: 'bboldner@test.intershop.de',
    singleCostCenterID: '100401',
    singleCostCenterName: 'Oil Corp Subsidiary 1',
    multipleCostCenterID: '100402',
    multipleCostCenterName: 'Oil Corp Subsidiary 2',
    loginMultipleCostCenters: 'jlink@test.intershop.de',
    password: sensibleDefaults.password,
  },
  products: {
    sku: ['201807181', '201807199', '201807197'],
    price: 185.5,
  },
};

describe('Shopping User B2B', () => {
  it('user with multiple cost centers should start checkout with a selected cost center', () => {
    ProductDetailPage.navigateTo(_.products.sku[0]);
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      page.header.gotoLoginPage();
    });
    at(LoginPage, page => {
      page.fillForm(_.user.loginMultipleCostCenters, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      expect(page.costCenterSelection).exist;
      page.selectCostCenter(_.user.multipleCostCenterID);
      page.beginCheckout();
    });
    at(CheckoutPaymentPage, page => {
      page.header.logout();
    });
  });

  it('user with no cost centers should start checkout with no cost center', () => {
    ProductDetailPage.navigateTo(_.products.sku[1]);
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      page.header.gotoLoginPage();
    });
    at(LoginPage, page => {
      page.fillForm(_.user.loginNoCostCenter, _.user.password);
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

  it('should proceed a checkout with cost center', () => {
    ProductDetailPage.navigateTo(_.products.sku[2]);
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      page.header.gotoLoginPage();
    });
    at(LoginPage, page => {
      page.fillForm(_.user.loginSingleCostCenter, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      expect(page.costCenterSelection).exist;
      page.beginCheckout();
    });
    // TODO: This is potentially instable. Create test users, when cost center administration is available and adapt this test.
    at(CheckoutPaymentPage, page => {
      page.selectPayment('INVOICE');
      page.continueCheckout();
    });
    at(CheckoutReviewPage, page => {
      expect(page.costCenterInformation).exist;
      page.costCenterInformation.should('contain', `${_.user.singleCostCenterID} ${_.user.singleCostCenterName}`);
      page.acceptTAC();
      page.submitOrder();
    });
    at(CheckoutReceiptPage, page => {
      expect(page.costCenterInformation).exist;
      page.costCenterInformation.should('contain', `${_.user.singleCostCenterID} ${_.user.singleCostCenterName}`);
    });
  });
});

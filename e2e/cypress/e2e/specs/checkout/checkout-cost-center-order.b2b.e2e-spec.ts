import { at } from '../../framework';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { CheckoutReceiptPage } from '../../pages/checkout/checkout-receipt.page';
import { CheckoutReviewPage } from '../../pages/checkout/checkout-review.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  costCenter: {
    id: '100401',
    name: 'Oil Corp Subsidiary 1',
  },
  user: {
    login: 'bboldner@test.intershop.de',
    password: sensibleDefaults.password,
  },
  sku: '201807197',
};

describe('Shopping User B2B', () => {
  it('should proceed a checkout with cost center', () => {
    LoginPage.navigateTo(`/prd${_.sku}`);
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    at(ProductDetailPage, page => {
      page.addProductToCart();
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.lineItems.should('have.length.at.least', 1);
    });
    at(CartPage, page => {
      page.costCenterSelection.should('exist');
      page.beginCheckout();
    });
    // TODO: This is potentially instable. Create test users, when cost center administration is available and adapt this test.
    at(CheckoutPaymentPage, page => {
      page.selectPayment('INVOICE');
      page.continueCheckout();
    });
    at(CheckoutReviewPage, page => {
      page.costCenterInformation.should('exist');
      page.costCenterInformation.should('contain', `${_.costCenter.id} ${_.costCenter.name}`);
      page.acceptTAC();
      page.submitOrder();
    });
    at(CheckoutReceiptPage, page => {
      page.costCenterInformation.should('exist');
      page.costCenterInformation.should('contain', `${_.costCenter.id} ${_.costCenter.name}`);
    });
  });
});

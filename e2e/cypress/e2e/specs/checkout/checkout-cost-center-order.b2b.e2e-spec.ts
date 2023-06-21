import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { CheckoutReceiptPage } from '../../pages/checkout/checkout-receipt.page';
import { CheckoutReviewPage } from '../../pages/checkout/checkout-review.page';
import { HomePage } from '../../pages/home.page';
import { CostCenterBuyersPage } from '../../pages/organizationmanagement/cost-center-buyers.page';
import { CostCenterCreatePage } from '../../pages/organizationmanagement/cost-center-create.page';
import { CostCenterDetailPage } from '../../pages/organizationmanagement/cost-center-detail.page';
import { CostCentersPage } from '../../pages/organizationmanagement/cost-centers.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  costCenter: {
    costCenterId: '100401',
    name: 'Oil Corp Subsidiary 1',
    budgetValue: 999,
    budgetPeriod: 'monthly',
  },
  user: {
    ...sensibleDefaults,
    login: `test${new Date().getTime()}@testcity.de`,
  },
  sku: '201807197',
};

describe('Shopping User B2B', () => {
  before(() => {
    createB2BUserViaREST(_.user);
    LoginPage.navigateTo('/account/organization/cost-centers');
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    at(CostCentersPage, page => page.addCostCenter());
    at(CostCenterCreatePage, page => {
      page.fillForm({ ..._.costCenter, costCenterManager: _.user.login });
      page.submit();
    });
    at(CostCenterDetailPage, page => page.addBuyers());
    at(CostCenterBuyersPage, page => {
      page.checkBuyer();
      page.submit();
    });
    at(CostCenterDetailPage, page => {
      page.header.gotoHomePage();
    });
    at(HomePage, page => {
      page.gotoFeaturedProduct('201807181');
    });
  });

  it('should see a cost center selection at cart page', () => {
    at(ProductDetailPage, page => {
      page.addProductToCart();
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.lineItems.should('have.length.at.least', 1);
      page.costCenterSelection.should('exist');
      page.beginCheckout();
    });
  });

  it('should proceed a checkout with cost center', () => {
    at(CheckoutPaymentPage, page => {
      page.selectPayment('INVOICE');
      page.continueCheckout();
    });
    at(CheckoutReviewPage, page => {
      page.costCenterInformation.should('exist');
      page.costCenterInformation.should('contain', `${_.costCenter.costCenterId} ${_.costCenter.name}`);
      page.acceptTAC();
      page.submitOrder();
    });
    at(CheckoutReceiptPage, page => {
      page.costCenterInformation.should('exist');
      page.costCenterInformation.should('contain', `${_.costCenter.costCenterId} ${_.costCenter.name}`);
    });
  });
});

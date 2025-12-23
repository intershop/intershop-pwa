import { at, waitLoadingEnd } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { OrderDetailsPage } from '../../pages/account/order-details.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { CheckoutReceiptPage } from '../../pages/checkout/checkout-receipt.page';
import { CheckoutReviewPage } from '../../pages/checkout/checkout-review.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  user: {
    ...sensibleDefaults,
    login: `test${new Date().getTime()}@testcity.de`,
  },
  sku: '201807197',
  sku2: '1941146',
  projectNumber: 'prj4711',
  commissionNumber: 'com4711',
};

describe('Edit and Display Custom Fields on Cart and Checkout B2B', () => {
  before(() => {
    createB2BUserViaREST(_.user);
    ProductDetailPage.navigateTo(_.sku);
    at(ProductDetailPage, page => {
      page.addProductToCart();
    });
    ProductDetailPage.navigateTo(_.sku2);
  });

  it('should display custom form field toggle links on cart page', () => {
    at(ProductDetailPage, page => {
      page.addProductToCart();
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.lineItems.should('have.length.at.least', 2);

      page.basketCustomFieldsToggleLink.should('exist');
      page.basketCustomFieldsForm.should('not.be.visible');

      page.lineItemCustomFieldsToggleLinks.should('have.length.at.least', 2);
      page.lastLineItemCustomFieldsForm.should('not.be.visible');
    });
  });

  it('should allow the user to enter a basket custom form field value', () => {
    at(CartPage, page => {
      page.basketCustomFieldsToggleLink.click();
      page.basketCustomFieldsForm.should('be.visible');

      page.basketCustomFieldsForm.find('input').first().scrollIntoView();
      page.submitBasketCustomFieldValue(_.projectNumber);
      page.basketCustomFieldsForm.should('not.be.visible');
      page.basketCustomFields.should('contain', _.projectNumber);
    });
  });

  it('should allow the user to enter a line item custom form field value', () => {
    at(CartPage, page => {
      page.lineItemCustomFieldsToggleLinks.last().click();
      page.lastLineItemCustomFieldsForm.should('be.visible');

      page.lastLineItemCustomFieldsForm.find('input').last().scrollIntoView();
      page.submitLastLineItemCustomFieldValue(_.commissionNumber);
      page.lastLineItemCustomFieldsForm.should('not.be.visible');
      page.getLineItemCustomFields(_.sku2).should('contain', _.commissionNumber);
    });
  });

  it('should still display the custom attributes after logging in', () => {
    at(CartPage, page => page.header.gotoLoginPage());
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    waitLoadingEnd();

    at(MyAccountPage, page => page.header.miniCart.goToCart());
    at(CartPage, page => {
      page.basketCustomFields.should('contain', _.projectNumber);
      page.getLineItemCustomFields(_.sku2).should('contain', _.commissionNumber);
    });
  });

  it('should display the custom attributes on review and receipt page', () => {
    at(CartPage, page => {
      page.beginCheckout();
    });
    at(CheckoutPaymentPage, page => {
      page.selectPayment('INVOICE');
      page.continueCheckout();
    });
    at(CheckoutReviewPage, page => {
      page.basketCustomFields.should('contain', _.projectNumber);
      page.getLineItemCustomFields(_.sku2).should('contain', _.commissionNumber);
      page.acceptTAC();
      page.submitOrder();
    });
    at(CheckoutReceiptPage, page => {
      page.orderCustomFields.should('contain', _.projectNumber);
      page.getLineItemCustomFields(_.sku2).should('contain', _.commissionNumber);
    });
  });

  it('should display the custom attributes on order details page', () => {
    at(CheckoutReceiptPage, page => {
      page.navigateToOrderDetailPage();
    });
    at(OrderDetailsPage, page => {
      page.orderCustomFields.should('contain', _.projectNumber);
      page.getLineItemCustomFields(_.sku2).should('contain', _.commissionNumber);
    });
  });
});

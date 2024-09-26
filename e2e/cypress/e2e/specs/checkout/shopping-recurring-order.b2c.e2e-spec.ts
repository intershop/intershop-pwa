import { at } from '../../framework';
import { createBasketViaREST, createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { CheckoutReceiptPage } from '../../pages/checkout/checkout-receipt.page';
import { CheckoutReviewPage } from '../../pages/checkout/checkout-review.page';
import { HomePage } from '../../pages/home.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

// Variable to store recurring order configuration status
let isRecurringOrderConfigured: boolean | undefined;

before(() => {
  // Initialize recurring order configuration
  if (isRecurringOrderConfigured === undefined) {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('ICM_BASE_URL')}/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-/configurations`,
      headers: {
        'content-type': 'application/json',
        Accept: 'application/vnd.intershop.configuration.v1+json',
      },
    }).then(response => {
      expect(response.status).to.equal(200);
      const recurringOrderEnabled = response.body?.data?.recurringOrder?.enabled;
      isRecurringOrderConfigured = recurringOrderEnabled === true;
    });
  }
});

const _ = {
  user: {
    ...sensibleDefaults,
    login: `test${new Date().getTime()}@testcity.de`,
  },
  catalog: 'Home-Entertainment',
  category: {
    id: 'Home-Entertainment.SmartHome',
    name: 'Smart Home',
  },
  product: {
    sku: '201807171',
    price: 175.0,
  },
  recurringOrder: {
    repetitions: 3,
  },
};

describe('Shopping Recurring Order', () => {
  before(function () {
    if (!isRecurringOrderConfigured) {
      // Skip this test suite if recurring orders ARE NOT configured
      this.skip();
    } else {
      createUserViaREST(_.user);
      createBasketViaREST(_.user, { [_.product.sku]: 1 });
    }
  });

  describe('checkout with recurring order for anonymous user', () => {
    before(() => HomePage.navigateTo());

    it('should open login page for recurring order checkout of anonymous user', () => {
      at(HomePage, page => page.header.gotoCategoryPage(_.catalog));
      at(CategoryPage, page => page.gotoSubCategory(_.category.id));
      at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
      at(ProductDetailPage, page => {
        page.addProductToCart().its('response.statusCode').should('equal', 201);
        page.header.miniCart.goToCart();
      });
      at(CartPage, page => {
        page.fillOutRecurringOrderForm(_.recurringOrder.repetitions.toString());
        page.beginCheckout();
      });
      at(LoginPage);
    });
  });

  describe('checkout with recurring order for logged in user', () => {
    it('should start checkout by logging in', () => {
      LoginPage.navigateTo('/basket');
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.user.password);
        page.submit().its('response.statusCode').should('equal', 200);
      });
    });

    it('should set up recurring order', () => {
      at(CartPage, page => {
        page.fillOutRecurringOrderForm(_.recurringOrder.repetitions.toString());

        cy.get('[data-testing-id="repetitions"]').should('have.value', _.recurringOrder.repetitions.toString());
        page.beginCheckout();
      });
    });

    it('should select invoice payment with recurring order info', () => {
      at(CheckoutPaymentPage, page => {
        cy.get('[data-testing-id="recurring-order-info"]').should('exist');
        cy.get('[data-testing-id="repetitions-number"]')
          .should('be.visible')
          .and('contain', _.recurringOrder.repetitions.toString());

        page.selectPayment('INVOICE');
        page.continueCheckout();
      });
    });

    it('should review recurring order and submit', () => {
      at(CheckoutReviewPage, page => {
        cy.get('[data-testing-id="recurring-order-info"]').should('exist');
        cy.get('[data-testing-id="repetitions-number"]')
          .should('be.visible')
          .and('contain', _.recurringOrder.repetitions.toString());

        page.acceptTAC();
        page.submitOrder();
      });
    });

    it('should show receipt with recurring order details', () => {
      at(CheckoutReceiptPage, _page => {
        cy.get('[data-testing-id="recurring-order-info"]').should('exist');
        cy.get('[data-testing-id="repetitions-number"]')
          .should('be.visible')
          .and('contain', _.recurringOrder.repetitions.toString());
      });
    });

    it('should go to recurring order detail page in my account', () => {
      at(CheckoutReceiptPage, page => {
        page.goToDetailPageOfOrder();
      });
      cy.get('[data-testing-id="recurring-order-info"]')
        .should('exist')
        .and('contain', _.recurringOrder.repetitions.toString());
    });

    it('should show the recurring order in the list', () => {
      cy.get('[data-testing-id="recurring-orders-link"]').click();

      cy.get('ish-account-recurring-orders-page').should('exist');
      cy.get('[data-testing-id="recurringOrder-list"]').should('exist');
      cy.get('[data-testing-id="recurringOrder-list"] tr').should('have.length.gt', 1);
    });
  });
});

describe('Not Configured Shopping Recurring Order', () => {
  before(function () {
    if (isRecurringOrderConfigured) {
      // Skip this test suite if recurring orders ARE configured
      this.skip();
    } else {
      createUserViaREST(_.user);
      createBasketViaREST(_.user, { [_.product.sku]: 1 });
    }
  });

  describe('checkout with recurring order not possible', () => {
    before(() => HomePage.navigateTo());

    it('should not display recurring order checkout in the cart', () => {
      at(HomePage, page => page.header.gotoCategoryPage(_.catalog));
      at(CategoryPage, page => page.gotoSubCategory(_.category.id));
      at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
      at(ProductDetailPage, page => {
        page.addProductToCart().its('response.statusCode').should('equal', 201);
        page.header.miniCart.goToCart();
      });
      at(CartPage);

      cy.get('[data-testing-id="enable-recurring-order"]').should('not.exist');
    });
  });
});

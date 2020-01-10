import { at } from '../../framework';
import { createBasketViaREST, createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CheckoutAddressesPage } from '../../pages/checkout/checkout-addresses.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { CheckoutShippingPage } from '../../pages/checkout/checkout-shipping.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  product1: {
    sku: '201807171',
  },
  product2: {
    sku: '201807191',
  },
};

describe('Shopping User', () => {
  before(() => {
    createUserViaREST(_.user);
    createBasketViaREST(_.user, { [_.product1.sku]: 2, [_.product2.sku]: 1 });
  });

  it('should start checkout by logging in', () => {
    LoginPage.navigateTo('/checkout/address');
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page
        .submit()
        .its('status')
        .should('equal', 200);
    });
  });

  it('should set first addresses automatically', () => {
    at(CheckoutAddressesPage, page => {
      cy.wait(1000);
      page.continueCheckout();
    });
  });

  it('should accept default shipping option', () => {
    at(CheckoutShippingPage, page => page.continueCheckout());
  });

  it('should fill in form for cypress credit card incorrectly and see errors', () => {
    at(CheckoutPaymentPage, page => {
      page.addPaymentInstrument('ISH_DEBIT_TRANSFER');
    });
    at(CheckoutPaymentPage, page => {
      page.paymentInstrument('ISH_DEBIT_TRANSFER').fillForm({
        IBAN: '1',
        BIC: 'A',
      });
      page.paymentInstrument('ISH_DEBIT_TRANSFER').submit();
      page
        .paymentInstrument('ISH_DEBIT_TRANSFER')
        .formError('holder')
        .should('contain', 'missing');
      /* TODO: size validator does not display message correctly
      page
        .paymentInstrument('ISH_DEBIT_TRANSFER')
        .formError('IBAN')
        .should('contain', 'must have a length'); */
    });
  });

  it('should fill in form for cypress credit card correctly and submit', () => {
    at(CheckoutPaymentPage, page => {
      page.paymentInstrument('ISH_DEBIT_TRANSFER').fillForm({
        holder: 'Peter Parker',
        IBAN: 'DE 000000000000000000',
        BIC: '12345678',
      });
      page
        .paymentInstrument('ISH_DEBIT_TRANSFER')
        .formError('holder')
        .should('not.be.visible');
      page
        .paymentInstrument('ISH_DEBIT_TRANSFER')
        .formError('IBAN')
        .should('not.be.visible');
      page
        .paymentInstrument('ISH_DEBIT_TRANSFER')
        .formError('BIC')
        .should('not.be.visible');
      page.paymentInstrument('ISH_DEBIT_TRANSFER').submit();
    });
  });

  it('should contain entered payment instrument', () => {
    at(CheckoutPaymentPage, page => page.content.should('contain', '*****************0000'));
  });
});

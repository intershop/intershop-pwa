import { at } from '../../framework';
import { createBasketViaREST, createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { PaymentPage } from '../../pages/account/payment.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CheckoutAddressesPage } from '../../pages/checkout/checkout-addresses.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { CheckoutShippingPage } from '../../pages/checkout/checkout-shipping.page';
import { HomePage } from '../../pages/home.page';

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

describe('Checkout Payment', () => {
  before(() => {
    createUserViaREST(_.user);
    createBasketViaREST(_.user, { [_.product1.sku]: 2, [_.product2.sku]: 1 });
  });

  describe('Within the Checkout', () => {
    it('should start checkout by logging in', () => {
      LoginPage.navigateTo('/checkout/address');
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.user.password);
        page.submit().its('response.statusCode').should('equal', 200);
      });
    });

    it('should set first addresses automatically', () => {
      at(CheckoutAddressesPage, page => {
        page.continueCheckout();
      });
    });

    it('should accept default shipping option', () => {
      at(CheckoutShippingPage, page => page.continueCheckout());
    });

    it('should open payment parameters form with/without saveForLater checkbox on payment page', () => {
      at(CheckoutPaymentPage, page => {
        page.addPaymentInstrument('ISH_CREDITCARD');
        page.saveForLaterCheckbox.should('be.visible');
      });
      at(CheckoutPaymentPage, page => {
        page.addPaymentInstrument('ISH_DEBIT_TRANSFER');
        page.saveForLaterCheckbox.should('not.be.visible');
      });
    });

    it('should fill in form for debit transfer incorrectly and see errors', () => {
      at(CheckoutPaymentPage, page => {
        page.paymentInstrument('ISH_DEBIT_TRANSFER').fillForm({
          IBAN: '1',
          BIC: 'A',
        });
        page.paymentInstrument('ISH_DEBIT_TRANSFER').submit();
        page.paymentInstrument('ISH_DEBIT_TRANSFER').formError('holder').log('ish debit transfer');
        page.paymentInstrument('ISH_DEBIT_TRANSFER').formError('holder').should('contain', 'missing');
        /* TODO: size validator does not display message correctly
      page
        .paymentInstrument('ISH_DEBIT_TRANSFER')
        .formError('IBAN')
        .should('contain', 'must have a length'); */
      });
    });

    it('should fill in form for debit transfer correctly and submit', () => {
      at(CheckoutPaymentPage, page => {
        page.paymentInstrument('ISH_DEBIT_TRANSFER').fillForm({
          holder: 'Peter Parker',
          IBAN: 'DE000000000000000001',
          BIC: '12345678',
        });
        page.paymentInstrument('ISH_DEBIT_TRANSFER').formError('holder').should('not.exist');
        page.paymentInstrument('ISH_DEBIT_TRANSFER').formError('IBAN').should('not.exist');
        page.paymentInstrument('ISH_DEBIT_TRANSFER').formError('BIC').should('not.exist');
        page.paymentInstrument('ISH_DEBIT_TRANSFER').submit();
      });
      at(CheckoutPaymentPage, page => page.content.should('contain', '****************0001'));
    });

    it('should delete a direct debit transfer', () => {
      at(CheckoutPaymentPage, page => {
        page.paymentInstrument('ISH_DEBIT_TRANSFER').delete();
        page.content.should('not.contain', '****************0001');
      });
    });

    it('should fill in form for another debit transfer correctly and submit', () => {
      at(CheckoutPaymentPage, page => {
        page.addPaymentInstrument('ISH_DEBIT_TRANSFER');
        page.paymentInstrument('ISH_DEBIT_TRANSFER').fillForm({
          holder: 'Patricia Miller',
          IBAN: 'DE000000000000000000',
          BIC: '12345678',
        });
        page.paymentInstrument('ISH_DEBIT_TRANSFER').submit();
        page.content.should('contain', '****************0000');
      });
    });

    it('should fill in form for credit card correctly with saving it and submit', () => {
      at(CheckoutPaymentPage, page => {
        page.addPaymentInstrument('ISH_CREDITCARD');
        page.paymentInstrument('ISH_CREDITCARD').fillForm({
          creditCardNumber: '4111111111111111',
          creditCardType: 'vsa',
          creditCardExpiryDate: '12/22',
        });
        page.paymentInstrument('ISH_CREDITCARD').submit();
      });
      at(CheckoutPaymentPage, page => page.content.should('contain', '********1111'));
    });

    it('should fill in form for credit card correctly without saving it for later and submit', () => {
      at(CheckoutPaymentPage, page => {
        page.addPaymentInstrument('ISH_CREDITCARD');
        page.paymentInstrument('ISH_CREDITCARD').fillForm({
          creditCardNumber: '5555555555554444',
          creditCardType: 'mas',
          creditCardExpiryDate: '12/22',
        });
        page.paymentInstrument('ISH_CREDITCARD').uncheckSaveForLater();
        page.paymentInstrument('ISH_CREDITCARD').submit();
      });
      at(CheckoutPaymentPage, page => page.content.should('contain', '********4444'));
    });
  });

  describe('Within the MyAccount', () => {
    before(() => {
      at(CheckoutPaymentPage, page => page.header.gotoHomePage());
      at(HomePage, page => page.header.goToMyAccount());
      at(MyAccountPage, page => page.navigateToPayments());
    });

    it('should display saved credit cards on myAccount page', () => {
      at(PaymentPage, page => {
        page.content.should('contain', '********1111');
        page.content.should('not.contain', '********4444');
        page.content.should('not.contain', '****************0000');
      });
    });
  });
});

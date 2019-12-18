import { at } from '../../framework';
import { createBasketViaREST, createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { AddressesPage } from '../../pages/checkout/addresses.page';
import { ShippingPage } from '../../pages/checkout/shipping.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
    countryCodeSwitch: 'US',
    mainDivisionCode: 'AS',
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

  it('should display invalid items if the invoice/shipping address is invalid', () => {
    at(AddressesPage, page => {
      cy.wait(1000);
      page.continueCheckout();
      cy.wait(1000);
    });
    at(AddressesPage, page => {
      page.validationMessage.should('contain', 'There is no shipping method available for this location');
    });
  });

  it('should remove validation messages after customer address changed', () => {
    at(AddressesPage, page => {
      page.changeInvoiceAddressRegion('CA');
      cy.wait(1000);
      page.validationMessage.should('not.exist');
    });
  });

  it('should continue checkout if validation problem has been solved', () => {
    at(AddressesPage, page => {
      page.continueCheckout();
      cy.wait(1000);
    });
    at(ShippingPage, () => {
      cy.contains('Select a Shipping Method');
    });
  });
});

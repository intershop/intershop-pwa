import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { AddressDetailsTypes, AddressesPage } from '../../pages/account/addresses.page';
import { LoginPage } from '../../pages/account/login.page';
import { Registration, sensibleDefaults } from '../../pages/account/registration.page';

const _ = {
  user: {
    login: `testuser${new Date().getTime()}@test.intershop.de`,
    ...sensibleDefaults,
    companyName1: 'Big Foods',
  } as Registration,
  address: {
    countryCode: 'DE',
    companyName1: 'Intershop',
    firstName: 'Pablo',
    lastName: 'Parked',
    addressLine1: 'Marcher Str. 87',
    city: 'Stuttgart',
    postalCode: '12345',
  } as AddressDetailsTypes,
  furtherAddress: {
    companyName1: 'Samsung',
    firstName: 'Daniel',
    lastName: 'Circus',
    addressLine1: 'Berg Str. 83',
    city: 'Heidelberg',
    postalCode: '36890',
    countryCode: 'DE',
  } as AddressDetailsTypes,
  newAddress: {
    companyName1: 'Samsung DE',
    firstName: 'Daniels',
    lastName: 'Decorous',
    addressLine1: 'HeidelBerg Str. 83',
    city: 'Heidelberg',
    postalCode: '36890',
    countryCode: 'DE',
  } as AddressDetailsTypes,
};

describe('Addresses Page Functionality', () => {
  before(() => {
    createB2BUserViaREST(_.user);
    LoginPage.navigateTo('/account/addresses');
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    at(AddressesPage, page => {
      page.defaultAddress.should('exist');
    });
  });

  it('should be able to create address and assign as shipping address', () => {
    at(AddressesPage, page => {
      page.createAddress();
      cy.wait(500);
      page.fillCreateAddressForm(_.address);
      page.saveAddress();
      page.furtherAddress.should('contain', _.address.addressLine1);
      page.selectShippingAddress();
      page.shippingAddress.should('contain', _.address.addressLine1);
    });
  });

  it('should be able to create a further address and see changes', () => {
    at(AddressesPage, page => {
      page.createAddress();
      page.fillCreateAddressForm(_.furtherAddress);
      page.saveAddress();
      page.furtherAddress.should('contain', _.furtherAddress.addressLine1);
    });
  });

  it('should be able to assign the further address as default invoice address', () => {
    at(AddressesPage, page => {
      page.selectInvoiceAddress();
      page.invoiceAddress.should('contain', _.furtherAddress.addressLine1);
    });
  });

  it('should be able to update address details and see changes', () => {
    at(AddressesPage, page => {
      page.updateAddress();
      page.fillUpdateAddressForm(_.newAddress).submit().its('response.statusCode').should('equal', 200);
      page.successMessage.message.should('contain', 'updated');
      page.furtherAddress.should('contain', `${_.newAddress.firstName} ${_.newAddress.lastName}`);
    });
  });

  it('should be able to delete an address and see changes', () => {
    at(AddressesPage, page => {
      page.deleteAddress();
      page.successMessage.message.should('contain', 'deleted');
    });
  });
});

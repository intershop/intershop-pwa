import { fillFormField } from '../../framework';
import { Registration } from '../account/registration.page';
import { HeaderModule } from '../header.module';

export type AddressDetailsTypes = Partial<
  Pick<Registration, 'countryCode' | 'companyName1' | 'firstName' | 'lastName' | 'addressLine1' | 'postalCode' | 'city'>
>;
export class AddressesPage {
  readonly header = new HeaderModule();
  readonly tag = 'ish-account-addresses';

  get defaultAddress() {
    return cy.get(this.tag).find('[data-testing-id="preferred-invoice-and-shipping-address"]');
  }

  get furtherAddress() {
    return cy.get(this.tag).find('[data-testing-id="further-addresses"]');
  }

  get shippingAddress() {
    return cy.get(this.tag).find('[data-testing-id="preferred-shipping-address"]');
  }

  get invoiceAddress() {
    return cy.get(this.tag).find('[data-testing-id="preferred-invoice-address"]');
  }

  createAddress() {
    cy.get('[data-testing-id="create-address-button"]').click();
  }

  fillForm(user: string, password: string) {
    cy.get('input[data-testing-id="login"]').clear().type(user).blur();
    cy.get('input[data-testing-id="password"]').clear().type(password).blur();
    return this;
  }

  fillCreateAddressForm(address: AddressDetailsTypes) {
    Object.keys(address).forEach(key => fillFormField('[data-testing-id="create-address-form"]', key, address[key]));
    return this;
  }

  fillUpdateAddressForm(address: AddressDetailsTypes) {
    Object.keys(address).forEach(key => fillFormField('[data-testing-id="update-address-form"]', key, address[key]));
    return this;
  }

  cancel() {
    cy.get('button').contains('Cancel').click();
  }

  saveAddress() {
    cy.get('button').contains('Save Address').click();
  }

  selectShippingAddress() {
    cy.get('select[placeholder="Change preferred shipping address"]').select(1);
  }

  selectInvoiceAddress() {
    cy.get('select[placeholder="Change preferred invoice address"]').select(2);
  }

  updateAddress() {
    cy.get('[data-testing-id="update-address-button"]').last().click();
  }

  submit() {
    cy.intercept('PUT', '**/customers/**').as('customers');
    cy.wait(500);

    cy.get(this.tag).find('button[type="submit"]').click();

    return cy.wait('@customers');
  }

  deleteAddress() {
    cy.get('[data-testing-id="delete-address-icon"]').last().click();
    cy.get('button').contains('Delete').click();
  }

  get successMessage() {
    return {
      message: cy.get('#toast-container').find('.toast-message'),
    };
  }
}

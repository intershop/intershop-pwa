import { fillFormField, waitLoadingEnd } from '../../framework';
import { Registration } from '../account/registration.page';

export type AddressDetailsTypes = Partial<
  Pick<Registration, 'countryCode' | 'firstName' | 'lastName' | 'addressLine1' | 'postalCode' | 'city'>
>;

export class CheckoutAddressesPage {
  readonly tag = 'ish-checkout-address-page';

  guestCheckout() {
    cy.get('button[data-testing-id="guest-checkout-button"]').click();
    waitLoadingEnd(1000);
  }

  fillInvoiceAddressForm(address: AddressDetailsTypes, email: string) {
    Object.keys(address).forEach(key => fillFormField('[data-testing-id="invoiceAddressForm"]', key, address[key]));
    fillFormField(this.tag, 'email', email);
    return this;
  }

  private selectFirst(type: string) {
    cy.get(`[data-testing-id="${type}"]`)
      .find('select')
      .first()
      .then(select => {
        const option = select.find('option').eq(1);
        const val = option.attr('value');
        cy.get(`[data-testing-id="${type}"]`).find('select').first().select(val);
      });
  }

  selectFirstInvoiceAddress() {
    this.selectFirst('invoiceToAddress');
    waitLoadingEnd();
  }

  selectFirstShippingAddress() {
    this.selectFirst('shipToAddress');
    waitLoadingEnd();
  }

  continueCheckout() {
    waitLoadingEnd(1000);
    cy.get('button').contains('Continue Checkout').click();
    waitLoadingEnd(1000);
  }

  editInvoiceAddress() {
    cy.get(`[data-testing-id="edit-invoice-address-link"]`).click();
  }

  changeInvoiceAddressRegion(regionCode) {
    this.editInvoiceAddress();
    cy.get(`[data-testing-id="invoice-address-form"]`)
      .find('select[data-testing-id="mainDivisionCode"]')
      .select(regionCode);
    cy.get(`[data-testing-id="invoice-address-form"]`).find('button.btn-primary').first().click();
    waitLoadingEnd(1000);
  }

  get validationMessage() {
    return cy.get('ish-basket-validation-results').find('.alert-box');
  }

  get infoMessage() {
    return cy.get('ish-basket-validation-results').find('.alert-info');
  }
}

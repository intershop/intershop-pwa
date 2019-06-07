import { Address } from 'ish-core/models/address/address.model';
import { waitLoadingEnd } from '../../framework';

export class AddressesPage {
  readonly tag = 'ish-checkout-address-page-container';

  // guest checkout
  guestCheckout() {
    cy.get('button[data-testing-id="guest-checkout-button"]').click();
  }

  fillInvoiceAddressForm(address: Address) {
    // tslint:disable-next-line:ban
    cy.get('[data-testing-id="invoiceAddressForm"] select[data-testing-id="countryCodeSwitch"]')
      .select(address.countryCode)
      .blur();
    cy.get('[data-testing-id="invoiceAddressForm"] input[data-testing-id="firstName"]')
      .clear()
      .type(address.firstName)
      .blur();
    cy.get('[data-testing-id="invoiceAddressForm"] input[data-testing-id="lastName"]')
      .clear()
      .type(address.lastName)
      .blur();
    cy.get('[data-testing-id="invoiceAddressForm"] input[data-testing-id="addressLine1"]')
      .clear()
      .type(address.addressLine1)
      .blur();
    cy.get('[data-testing-id="invoiceAddressForm"] input[data-testing-id="postalCode"]')
      .clear()
      .type(address.postalCode)
      .blur();
    cy.get('[data-testing-id="invoiceAddressForm"] input[data-testing-id="city"]')
      .clear()
      .type(address.city)
      .blur();
    cy.get('input[data-testing-id="email"]')
      .clear()
      .type(address.email)
      .blur();
    return this;
  }

  // change address
  private selectFirst(type: string) {
    cy.get(`[data-testing-id="${type}"]`)
      .find('select')
      .first()
      .then(select => {
        const option = select.find('option').eq(1);
        const val = option.attr('value');
        // tslint:disable-next-line:ban
        cy.get(`[data-testing-id="${type}"]`)
          .find('select')
          .first()
          .select(val);
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
    cy.get('button')
      .contains('Continue Checkout')
      .click();
  }
}

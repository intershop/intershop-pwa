import { fillFormField, waitLoadingEnd } from '../../framework';
import { Registration } from '../account/registration.page';

export declare type AddressDetailsTypes = Partial<
  Pick<Registration, 'countryCodeSwitch' | 'firstName' | 'lastName' | 'addressLine1' | 'postalCode' | 'city'>
>;

export class AddressesPage {
  readonly tag = 'ish-checkout-address-page-container';

  // guest checkout
  guestCheckout() {
    cy.get('button[data-testing-id="guest-checkout-button"]').click();
  }

  fillInvoiceAddressForm(address: AddressDetailsTypes, email: string) {
    Object.keys(address).forEach(key => fillFormField('[data-testing-id="invoiceAddressForm"]', key, address[key]));
    fillFormField(this.tag, 'email', email);
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

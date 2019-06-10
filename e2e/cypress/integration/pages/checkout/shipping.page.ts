export class ShippingPage {
  readonly tag = 'ish-checkout-shipping-page-container';

  continueCheckout() {
    cy.get('button')
      .contains('Continue Checkout')
      .click();
  }
}

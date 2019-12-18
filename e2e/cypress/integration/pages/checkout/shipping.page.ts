export class ShippingPage {
  readonly tag = 'ish-checkout-shipping-page';

  continueCheckout() {
    cy.get('button')
      .contains('Continue Checkout')
      .click();
  }
}

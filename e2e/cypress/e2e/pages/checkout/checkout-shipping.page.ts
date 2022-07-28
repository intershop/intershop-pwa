import { waitLoadingEnd } from '../../framework';

export class CheckoutShippingPage {
  readonly tag = 'ish-checkout-shipping-page';

  continueCheckout() {
    waitLoadingEnd(1000);
    cy.get('button').contains('Continue Checkout').click();
    waitLoadingEnd(1000);
  }
}

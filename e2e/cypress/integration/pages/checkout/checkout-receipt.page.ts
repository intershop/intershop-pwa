export class CheckoutReceiptPage {
  readonly tag = 'ish-checkout-receipt-page';

  continueShopping() {
    cy.get('a[data-testing-id="home-link"]').click();
  }
}

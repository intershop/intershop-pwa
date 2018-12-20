export class ReceiptPage {
  readonly tag = 'ish-checkout-receipt-page-container';

  continueShopping() {
    cy.get('a[data-testing-id="home-link"]').click();
  }
}

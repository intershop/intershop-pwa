export class CheckoutReceiptPage {
  readonly tag = 'ish-checkout-receipt-page';

  continueShopping() {
    cy.get('a[data-testing-id="home-link"]').click();
  }

  get costCenterInformation() {
    return cy.get('div[data-testing-id="buyer-cost-center"');
  }

  lineItemWarranty() {
    return cy.get('ish-line-item-list-element').find('ish-line-item-warranty');
  }
}

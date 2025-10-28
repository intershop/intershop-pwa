export class CheckoutReceiptPage {
  readonly tag = 'ish-checkout-receipt-page';

  continueShopping() {
    cy.get('a[data-testing-id="home-link"]').click();
  }

  get costCenterInformation() {
    return cy.get('div[data-testing-id="additional-info-cost-center"');
  }

  lineItemWarranty() {
    return cy.get('ish-line-item-list-element').find('ish-line-item-warranty');
  }

  goToDetailPageOfOrder() {
    cy.get('[data-testing-id="order-document-number-link"]').should('have.attr', 'href');
    cy.get('[data-testing-id="order-document-number-link"]').click();
  }
}

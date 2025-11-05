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

  get orderCustomFields() {
    return cy.get('[data-testing-id="additional-information-basket-custom-fields"]');
  }

  getLineItemCustomFields(sku: string) {
    return cy.get(`[data-testing-id="line-item-information-edit_${sku}"]`);
  }

  navigateToOrderDetailPage() {
    cy.get('[data-testing-id="order-document-number"] a').click();
  }
}

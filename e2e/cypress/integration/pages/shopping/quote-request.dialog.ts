import { waitLoadingEnd } from '../../framework';

export class QuoteRequestDialog {
  readonly tag = 'ish-product-add-to-quote-dialog';

  private saveQuoteRequestButton = () => cy.get('[data-testing-id="save-quote-request"]');
  private submitQuoteRequestButton = () => cy.get('[data-testing-id="submit-quote-request"]');
  private hideButton = () => cy.get('.close');
  private quantityInput = () => cy.get('[data-testing-id="quantity"]');

  saveQuoteRequest() {
    this.saveQuoteRequestButton().click();
  }

  submitQuoteRequest() {
    this.submitQuoteRequestButton().click();
    waitLoadingEnd(1000);
    return this.quoteId;
  }

  setQuantity(quantity: number) {
    this.quantityInput().type(quantity.toString());
  }

  hide() {
    this.hideButton().click();
  }

  get productId() {
    return cy.get('[itemprop="sku"]');
  }

  get quoteState() {
    return cy.get('ish-quote-state');
  }

  get quoteId(): Cypress.Chainable<string> {
    return cy
      .get('[data-testing-id="quoteId"]')
      .invoke('attr', 'data-quote-id')
      .then(s => (s as unknown) as string);
  }

  get totalPrice() {
    return cy.get('[data-testing-id="total-price"]');
  }

  deleteItemFromQuoteRequest() {
    cy.get(`a[title="Remove"]`).click();
  }

  assertClosed() {
    return cy.get(this.tag).should('not.exist');
  }
}

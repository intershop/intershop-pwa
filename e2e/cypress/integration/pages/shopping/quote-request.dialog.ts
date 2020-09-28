import { waitLoadingEnd } from '../../framework';

export class QuoteRequestDialog {
  readonly tag = 'ish-product-add-to-quote-dialog';

  private submitQuoteRequestButton = () => cy.get('[data-testing-id="submit-quote-request"]');
  private copyQuoteRequestButton = () => cy.get('[data-testing-id="copy-quote-request"]');

  private hideButton = () => cy.get('.close');
  private quantityInput = () => cy.get('[data-testing-id="quantity"]');

  submitQuoteRequest() {
    this.submitQuoteRequestButton().click();
    waitLoadingEnd(1000);
    return this.quoteId;
  }

  copyQuoteRequest() {
    this.copyQuoteRequestButton().click();
    waitLoadingEnd();
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

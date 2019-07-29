import { HeaderModule } from '../header.module';

export class QuoteDetailPage {
  readonly tag = 'ish-quote-edit';

  readonly header = new HeaderModule();

  private copyQuoteRequestButton = () => cy.get('[data-testing-id="copy-quote-request"]');

  copyQuoteRequest() {
    this.copyQuoteRequestButton().click();
  }

  get quantity() {
    return cy.get('input[data-testing-id="quantity"]');
  }

  get productId() {
    return cy.get('p[data-testing-id="product-id"]');
  }

  get totalPrice() {
    return cy.get('[data-testing-id="total-price"]');
  }

  get quoteState() {
    return cy.get('ish-quote-state');
  }

  deleteItemFromQuoteRequest() {
    cy.get(`a[title="Remove"]`).click();
  }
}

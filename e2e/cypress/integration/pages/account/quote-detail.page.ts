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
    return cy.get('[itemprop="sku"]');
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

  saveQuoteRequest() {
    cy.get('[data-testing-id="save-quote-request"]').click();
  }

  submitQuoteRequest() {
    cy.get('[data-testing-id="submit-quote-request"]').click();
  }
}

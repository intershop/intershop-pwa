import { waitLoadingEnd } from '../../framework';
import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class QuoteDetailPage {
  readonly tag = 'ish-quote-page';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  private copyQuoteRequestButton = () => cy.get('[data-testing-id="copy-quote-request"]');

  copyQuoteRequest() {
    this.copyQuoteRequestButton().click();
    waitLoadingEnd(1000);
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
    waitLoadingEnd(1000);
  }

  submitQuoteRequest() {
    cy.get('[data-testing-id="submit-quote-request"]').click();
    waitLoadingEnd(1000);
  }
}

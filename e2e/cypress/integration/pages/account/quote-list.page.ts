import { HeaderModule } from '../header.module';

export class QuoteListPage {
  readonly tag = 'ish-quote-list';

  readonly header = new HeaderModule();

  static navigateTo() {
    cy.visit('/account/quotes');
  }

  goToQuoteDetailLink(id: string) {
    cy.get(`a[href="/account/quotes/request/${id}"], a[href="/account/quotes/${id}"]`).first().click();
  }
}

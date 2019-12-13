import { HeaderModule } from '../header.module';

export class QuoteListPage {
  readonly tag = 'ish-quote-list';

  readonly header = new HeaderModule();

  static navigateTo() {
    cy.visit('/account/quote-list');
  }

  goToQuoteDetailLink(id: string) {
    cy.get(`a[href="/account/quote-request/${id}"], a[href="/account/quote/${id}"]`)
      .first()
      .click();
  }
}

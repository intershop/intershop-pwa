import { waitLoadingEnd } from '../../framework';
import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class QuoteListPage {
  readonly tag = 'ish-quote-list';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  static navigateTo() {
    cy.visit('/account/quotes');
  }

  goToQuoteDetailLink(id: string) {
    cy.get(`a[href="/account/quotes/request/${id}"], a[href="/account/quotes/${id}"]`).first().click();
  }

  deleteQuote(idx: number) {
    cy.get('a[title=Delete]').eq(idx).click();
    cy.get('[data-testing-id="confirm"]').click();
    waitLoadingEnd(1000);
  }
}

export class RecentlyViewedPage {
  readonly tag = 'ish-recently-page';

  get recentlyViewedItems() {
    return cy.get('ish-recently-viewed-all ish-product-tile');
  }

  clearAllRecentlyViewedItems() {
    cy.get('[data-testing-id=clear-all]').click();
  }
}

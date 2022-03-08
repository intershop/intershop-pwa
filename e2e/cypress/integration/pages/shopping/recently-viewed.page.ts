export class RecentlyViewedPage {
  readonly tag = 'ish-recently-page';

  get recentlyViewedItems() {
    return cy.get(`${this.tag} ish-product-tile`);
  }

  clearAllRecentlyViewedItems() {
    cy.get('[data-testing-id=clear-all]').click();
  }
}

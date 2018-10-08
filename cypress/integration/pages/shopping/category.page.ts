export class CategoryPage {
  readonly tag = 'ish-category-page';

  gotoSubCategory(categoryUniqueId: string) {
    cy.get(`div[data-testing-id="category-${categoryUniqueId}"] a`).click({ force: true });
  }

  get subCategories() {
    return cy.get('div.category-name');
  }

  get content() {
    return cy.get(this.tag);
  }
}

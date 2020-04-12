import { waitLoadingEnd } from '../../framework';

export class CategoryPage {
  readonly tag = 'ish-category-categories';

  gotoSubCategory(categoryUniqueId: string) {
    cy.get(`div[data-testing-id="category-${categoryUniqueId}"] a`).click({ force: true });
    waitLoadingEnd();
  }

  get subCategories() {
    return cy.get('div.category-name');
  }

  get content() {
    return cy.get(this.tag);
  }

  get categoryId() {
    return cy.get(`${this.tag} .category-page`).invoke('attr', 'data-testing-id');
  }
}

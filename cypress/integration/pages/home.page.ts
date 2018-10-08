import { HeaderModule } from './header.module';

export class HomePage {
  readonly tag = 'ish-home-page-container';

  readonly header = new HeaderModule();

  static navigateTo() {
    cy.visit('/');
  }

  gotoCategoryPage(categoryUniqueId: string) {
    cy.get(`ish-header [data-testing-id="${categoryUniqueId}-link"]`)
      .last()
      .click();
  }

  get content() {
    return cy.get(this.tag);
  }
}

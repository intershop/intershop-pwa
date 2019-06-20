import { MiniCartModule } from './checkout/mini-cart.module';

export class HeaderModule {
  miniCart = new MiniCartModule();

  get numberOfCompareItems() {
    return cy.get('.compare-status .badge').then(el => parseInt(el.text(), 10));
  }

  gotoHomePage() {
    cy.get('img[alt="Logo"]').click();
  }

  gotoLoginPage() {
    cy.get('.my-account-login').click();
  }

  gotoRegistrationPage() {
    cy.get('.my-account-register').click();
  }

  gotoCategoryPage(categoryUniqueId: string) {
    cy.get(`[data-testing-id="${categoryUniqueId}-link"]`).click();
  }

  logout() {
    cy.get('a.my-account-logout').click();
  }

  get myAccountLink() {
    return cy.get('[data-testing-id="link-myaccount"]');
  }

  goToMyAccount() {
    return this.myAccountLink.click();
  }

  get content() {
    return cy.get('ish-header');
  }

  getSearchSuggestions(searchTerm: string) {
    cy.get('input.searchTerm').type(searchTerm);
    cy.get('ul.search-suggest-results').should('be.visible');
    return cy.get('ul.search-suggest-results').get('span.searchTerm');
  }

  doProductSearch(searchTerm: string) {
    cy.get('input.searchTerm')
      .clear()
      .type(searchTerm)
      .type('{enter}');
  }

  topLevelCategoryLink(id: string) {
    return cy.get(`[data-testing-id="${id}-link"]`).first();
  }

  switchLanguage(lang: string) {
    cy.get('.language-switch-menu-container a')
      .should('contain', lang)
      .click();
  }
}

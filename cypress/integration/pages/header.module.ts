import { MiniCartModule } from './checkout/mini-cart.module';

export class HeaderModule {
  miniCart = new MiniCartModule();

  get numberOfCompareItems() {
    return cy
      .get('ish-header .compare-status .badge')
      .first()
      .then(el => Number.parseInt(el.text(), 10));
  }

  gotoHomePage() {
    cy.get('img[alt="Logo"]')
      .last()
      .click();
  }

  gotoLoginPage() {
    cy.get('ish-header a.my-account-login')
      .first()
      .click();
  }

  gotoRegistrationPage() {
    cy.get('ish-header a.my-account-register')
      .first()
      .click();
  }

  gotoCategoryPage(categoryUniqueId: string) {
    cy.get(`ish-header [data-testing-id="${categoryUniqueId}-link"]`)
      .last()
      .click();
  }

  logout() {
    cy.get('ish-header a.my-account-logout')
      .first()
      .click();
  }

  get myAccountLink() {
    return cy
      .get('a[data-testing-id="link-myaccount"]')
      .should('be.visible')
      .first();
  }

  get content() {
    return cy.get('ish-header', { timeout: 60000 });
  }

  getSearchSuggestions(searchTerm: string) {
    cy.get('ish-header input.searchTerm')
      .clear()
      .type(searchTerm);
    cy.get('ul.search-suggest-results', { timeout: 30000 }).should('be.visible');
    return cy
      .get('ul.search-suggest-results')
      .last()
      .get('span.searchTerm');
  }

  doProductSearch(searchTerm: string) {
    cy.get('ish-header input.searchTerm')
      .clear()
      .type(searchTerm)
      .type('{enter}');
  }

  topLevelCategoryLink(id: string) {
    return cy
      .get(`ish-header a[data-testing-id="${id}-link"]`, { timeout: 60000, log: true })
      .should('be.visible')
      .first();
  }

  switchLanguage(lang: string) {
    cy.get('ish-header span.language-switch-current-selection')
      .should('be.visible')
      .first()
      .click();

    cy.get('ish-header div.language-switch-menu-container a')
      .should('contain', lang)
      .first()
      .click();
  }
}

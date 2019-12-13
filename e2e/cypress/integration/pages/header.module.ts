import { MiniCartModule } from './checkout/mini-cart.module';

export class HeaderModule {
  miniCart = new MiniCartModule();

  get numberOfCompareItems() {
    cy.get('header').then(header => {
      if (!header.find('[data-testing-id="product-compare-count"]').length) {
        return cy.scrollTo('top');
      }
    });
    return cy
      .get('[data-testing-id="product-compare-count"]')
      .eq(0)
      .then(el => parseInt(el.text(), 10));
  }

  gotoHomePage() {
    cy.get('[data-testing-id="header-home-link-desktop"]').click();
  }

  gotoLoginPage() {
    cy.get('[data-testing-id="user-status-desktop"] .my-account-login').click();
  }

  gotoRegistrationPage() {
    cy.get('[data-testing-id="user-status-desktop"] .my-account-register').click();
  }

  gotoCategoryPage(categoryUniqueId: string) {
    cy.get(`[data-testing-id="${categoryUniqueId}-link"]`).click();
  }

  logout() {
    cy.get('[data-testing-id="user-status-desktop"] .my-account-logout').click();
  }

  get myAccountLink() {
    return cy.get('[data-testing-id="link-myaccount"]:visible');
  }

  goToMyAccount() {
    return this.myAccountLink.click();
  }

  get content() {
    return cy.get('ish-header');
  }

  getSearchSuggestions(searchTerm: string) {
    cy.get('[data-testing-id="search-box-desktop"] input.searchTerm').type(searchTerm);
    cy.get('ul.search-suggest-results').should('be.visible');
    return cy.get('ul.search-suggest-results').get('li button');
  }

  doProductSearch(searchTerm: string) {
    cy.get('[data-testing-id="search-box-desktop"] input.searchTerm')
      .clear()
      .type(searchTerm)
      .type('{enter}');
  }

  topLevelCategoryLink(id: string) {
    return cy.get(`[data-testing-id="${id}-link"]`).first();
  }

  switchLanguage(lang: string) {
    // expanding and click is not stable, so force click
    cy.get('[data-testing-id="language-switch-desktop"] .language-switch-menu-container a')
      .contains(lang)
      .click({ force: true });
  }
}

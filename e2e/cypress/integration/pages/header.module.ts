import { waitLoadingEnd } from '../framework';

import { MiniCartModule } from './checkout/mini-cart.module';
import { SearchBoxModule } from './shopping/search-box.module';

export class HeaderModule {
  miniCart = new MiniCartModule();
  searchBox = new SearchBoxModule();

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

  gotoHomePage(wait: () => unknown = waitLoadingEnd) {
    cy.get('[data-testing-id="header-home-link-desktop"]').click();
    wait();
  }

  gotoLoginPage(wait: () => unknown = waitLoadingEnd) {
    cy.get('[data-testing-id="user-status-desktop"] .my-account-login').click();
    wait();
  }

  gotoRegistrationPage(wait: () => unknown = waitLoadingEnd) {
    cy.get('[data-testing-id="user-status-desktop"] .my-account-register').click();
    wait();
  }

  gotoCategoryPage(categoryUniqueId: string, wait: () => unknown = waitLoadingEnd) {
    cy.get(`[data-testing-id="${categoryUniqueId}-link"]`).click();
    wait();
  }

  gotoWishlists(wait: () => unknown = waitLoadingEnd) {
    cy.get('ish-wishlists-link a').eq(0).click({ force: true });
    wait();
  }

  gotoQuickorder(wait: () => unknown = waitLoadingEnd) {
    cy.get('a[rel="quick-order"]').click();
    wait();
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
    cy.get('[data-testing-id="search-box-desktop"] input.searchTerm').clear().type(searchTerm).type('{enter}');
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

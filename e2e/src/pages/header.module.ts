import { $, $$, browser } from 'protractor';
import { protractor } from 'protractor/built/ptor';

export class HeaderModule {
  getNumberOfCompareItems() {
    return $('.header .compare-status')
      .getText()
      .then(s => Number.parseInt(s, 10));
  }

  gotoLoginPage() {
    $('.header a.my-account-login').click();
  }

  logout() {
    $('.header a.my-account-logout').click();
  }

  getSearchSuggestions(searchTerm: string) {
    $('.header input.searchTerm').clear();
    $('.header input.searchTerm').sendKeys(searchTerm);
    browser.wait($('ul.search-suggest-results').isPresent());
    return $$('ul.search-suggest-results li').getText();
  }

  productSearch(searchTerm: string) {
    $('.header input.searchTerm').clear();
    $('.header input.searchTerm').sendKeys(searchTerm);
    $('.header input.searchTerm').sendKeys(protractor.Key.ENTER);
  }

  getTopLevelCategory(id: string) {
    return $$(`.header a[data-testing-id="${id}-link"]`)
      .filter(e => e.isDisplayed())
      .first();
  }

  switchLanguage(lang: string) {
    $('.header span.language-switch-current-selection')
      .click()
      .then(() =>
        $$('.header div.language-switch-menu-container a')
          .filter(el => el.getText().then(text => text.search(lang) >= 0))
          .first()
          .click()
      );
  }
}

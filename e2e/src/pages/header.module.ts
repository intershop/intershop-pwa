import { $, $$, browser } from 'protractor';
import { protractor } from 'protractor/built/ptor';

export class HeaderModule {
  getNumberOfCompareItems() {
    return $('ish-header .compare-status')
      .getText()
      .then(s => Number.parseInt(s, 10));
  }

  gotoLoginPage() {
    $('ish-header a.my-account-login').click();
  }

  logout() {
    $('ish-header a.my-account-logout').click();
  }

  getSearchSuggestions(searchTerm: string) {
    $('ish-header input.searchTerm').clear();
    $('ish-header input.searchTerm').sendKeys(searchTerm);
    browser.wait($('ul.search-suggest-results').isPresent());
    return $$('ul.search-suggest-results li').getText();
  }

  productSearch(searchTerm: string) {
    $('ish-header input.searchTerm').clear();
    $('ish-header input.searchTerm').sendKeys(searchTerm);
    $('ish-header input.searchTerm').sendKeys(protractor.Key.ENTER);
  }

  getTopLevelCategory(id: string) {
    return $$(`ish-header a[data-testing-id="${id}-link"]`)
      .filter(e => e.isDisplayed())
      .first();
  }

  switchLanguage(lang: string) {
    $('ish-header span.language-switch-current-selection')
      .click()
      .then(() =>
        $$('ish-header div.language-switch-menu-container a')
          .filter(el => el.getText().then(text => text.search(lang) >= 0))
          .first()
          .click()
      );
  }
}

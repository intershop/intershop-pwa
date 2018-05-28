import { $, $$, browser } from 'protractor';
import { protractor } from 'protractor/built/ptor';

export class HeaderModule {
  getNumberOfCompareItems() {
    return $('#compare-count')
      .getText()
      .then(s => Number.parseInt(s));
  }

  gotoLoginPage() {
    $('a.my-account-login').click();
  }

  logout() {
    $('a.my-account-logout').click();
  }

  getSearchSuggestions(searchTerm: string) {
    $('input.searchTerm').clear();
    $('input.searchTerm').sendKeys(searchTerm);
    browser.wait($('ul.search-suggest-results').isPresent());
    return $$('ul.search-suggest-results li').getText();
  }

  productSearch(searchTerm: string) {
    $('input.searchTerm').clear();
    $('input.searchTerm').sendKeys(searchTerm);
    $('input.searchTerm').sendKeys(protractor.Key.ENTER);
  }
}

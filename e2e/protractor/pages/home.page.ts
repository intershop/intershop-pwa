import { $, browser } from 'protractor';

export class HomePage {
  tag = 'ish-home-page-container';

  static navigateTo() {
    browser.get('/');
  }

  getCategoryLink(categoryId) {
    return $('[data-testing-id="' + categoryId + '"]');
  }

  gotoCategoryPage(categoryId) {
    $('[data-testing-id="' + categoryId + '"]').click();
  }
  getContent() {
    return $('body').getText();
  }
}

import { $, browser } from 'protractor';
import { Page } from './page.interface';

export class HomePage implements Page {
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

import { $, browser } from 'protractor';
import { HeaderModule } from './header.module';

export class HomePage {
  readonly tag = 'ish-home-page-container';

  readonly header = new HeaderModule();

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

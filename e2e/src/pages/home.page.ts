import { $, $$, browser } from 'protractor';

import { HeaderModule } from './header.module';

export class HomePage {
  readonly tag = 'ish-home-page-container';

  readonly header = new HeaderModule();

  static navigateTo() {
    browser.get('/');
  }

  gotoCategoryPage(categoryUniqueId) {
    $$(`ish-header [data-testing-id="${categoryUniqueId}-link"]`)
      .filter(e => e.isDisplayed())
      .first()
      .click();
  }

  getContent() {
    return $('body').getText();
  }
}

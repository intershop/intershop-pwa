import { $, browser, by, element } from 'protractor';
import { CategoryPage } from './category.page';

export class HomePage {
  static navigateTo() {
    browser.get('/');
    return new HomePage();
  }

  getCategoryLink(categoryId) {
    return element(by.css('[data-testing-id="' + categoryId + '"]'));
  }

  gotoCategoryPage(categoryId): CategoryPage {
    $('[data-testing-id="' + categoryId + '"]').click();
    return new CategoryPage();
  }
  getContent() {
    return $('body').getText();
  }
}

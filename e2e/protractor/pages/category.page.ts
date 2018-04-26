import { $, $$, browser, by, element, promise } from 'protractor';
import { FamilyPage } from './family.page';

export class CategoryPage {
  static navigateTo(categoryId) {
    browser.get('/category/' + categoryId);
    return new CategoryPage();
  }

  gotoSubCategory(categoryId): CategoryPage | FamilyPage {
    $('div[data-testing-id="' + categoryId + '"] a').click();
    if ($('ish-family-page').isPresent()) {
      return new FamilyPage();
    }
    if ($('ish-category-page').isPresent()) {
      return new CategoryPage();
    }
  }

  getSubCategoryCount(): promise.Promise<number> {
    return $$('div.category-name').count();
  }
  getContent() {
    return $('body').getText();
  }
}

import { $, $$, promise } from 'protractor';

export class CategoryPage {
  readonly tag = 'ish-category-page';

  gotoSubCategory(categoryUniqueId) {
    $('div[data-testing-id="category-' + categoryUniqueId + '"] a').click();
  }

  getSubCategoryCount(): promise.Promise<number> {
    return $$('div.category-name').count();
  }
  getContent() {
    return $('body').getText();
  }
}

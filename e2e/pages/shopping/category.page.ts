import { $, $$, promise } from 'protractor';

export class CategoryPage {
  readonly tag = 'ish-category-page';

  gotoSubCategory(categoryId) {
    $('div[data-testing-id="' + categoryId + '"] a').click();
  }

  getSubCategoryCount(): promise.Promise<number> {
    return $$('div.category-name').count();
  }
  getContent() {
    return $('body').getText();
  }
}

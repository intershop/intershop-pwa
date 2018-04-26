import { $, $$, browser, promise } from 'protractor';
import { ProductPage } from './product.page';

export class FamilyPage {
  static navigateTo(categoryId) {
    browser.get('/category/' + categoryId);
    return new FamilyPage();
  }
  getVisibleProductsCount(): promise.Promise<number> {
    return $$('ish-product-tile').count();
  }

  gotoProductDetailPage(sku) {
    $('#product-' + sku).click();
    return new ProductPage();
  }
}

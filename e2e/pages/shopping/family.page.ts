import { $, $$, browser, promise } from 'protractor';
import { HeaderModule } from '../header.module';

export class FamilyPage {
  readonly tag = 'ish-family-page';

  readonly header = new HeaderModule();

  static navigateTo(categoryUniqueId: string) {
    browser.get(`/category/${categoryUniqueId}`);
  }

  getVisibleProductsCount(): promise.Promise<number> {
    return $$('ish-product-tile').count();
  }

  gotoProductDetailPageBySku(sku) {
    $('ish-product-tile div[data-testing-sku="' + sku + '"]').click();
  }

  addProductToCompareBySku(sku) {
    $('ish-product-tile div[data-testing-sku="' + sku + '"] button.add-to-compare').click();
  }
}

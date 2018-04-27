import { $, $$, promise } from 'protractor';

export class FamilyPage {
  tag = 'ish-family-page';

  getVisibleProductsCount(): promise.Promise<number> {
    return $$('ish-product-tile').count();
  }

  gotoProductDetailPageBySku(sku) {
    $('ish-product-tile div[data-testing-sku="' + sku + '"]').click();
  }
}

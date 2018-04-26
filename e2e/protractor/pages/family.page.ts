import { $, $$, promise } from 'protractor';
import { Page } from './page.interface';

export class FamilyPage implements Page {
  tag = 'ish-family-page';

  getVisibleProductsCount(): promise.Promise<number> {
    return $$('ish-product-tile').count();
  }

  gotoProductDetailPageBySku(sku) {
    $('#product-' + sku).click();
  }
}

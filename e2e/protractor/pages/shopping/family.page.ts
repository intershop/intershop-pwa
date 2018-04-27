import { $, $$, promise } from 'protractor';
import { Page } from '../../framework/page.interface';

export class FamilyPage implements Page {
  tag = 'ish-family-page';

  getVisibleProductsCount(): promise.Promise<number> {
    return $$('ish-product-tile').count();
  }

  gotoProductDetailPageBySku(sku) {
    $('ish-product-tile div[data-testing-sku="' + sku + '"]').click();
  }
}

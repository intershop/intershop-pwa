import { $$ } from 'protractor';

export class ComparePage {
  readonly tag = 'ish-product-compare-list';

  getVisibleCompareItemSKUs() {
    return $$('span[itemprop="sku"]').getText();
  }
}

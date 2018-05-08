import { $, $$ } from 'protractor';

export class ProductListModule {
  getVisibleProductsCount() {
    return $$('ish-product-tile').count();
  }

  gotoProductDetailPageBySku(sku) {
    $('ish-product-tile div[data-testing-sku="' + sku + '"]').click();
  }

  addProductToCompareBySku(sku) {
    $('ish-product-tile div[data-testing-sku="' + sku + '"] button.add-to-compare').click();
  }
}

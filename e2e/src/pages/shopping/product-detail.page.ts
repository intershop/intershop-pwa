import { $, browser } from 'protractor';

import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class ProductDetailPage {
  readonly tag = 'ish-product-page-container';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  static navigateTo(categoryUniqueId: string, sku: string) {
    browser.get(`/category/${categoryUniqueId}/product/${sku}`);
  }

  private addToCardButton = () => $('[data-testing-id="addToCartButton"]');
  private addToCompareButton = () => $('[data-testing-id*="compare"]');

  isComplete() {
    return this.addToCardButton().isPresent();
  }

  getSku() {
    return $('span[itemprop="sku"]').getText();
  }

  getPrice() {
    return $('div[data-testing-id="current-price"]').getText();
  }

  addProductToCompare() {
    this.addToCompareButton().click();
  }

  // tslint:disable-next-line:no-any
  getRecentlyViewedItems(sku?: string): any {
    return !sku
      ? $('ish-recently-viewed')
          .$$('div.product-tile')
          .getAttribute('data-testing-sku')
      : $('ish-recently-viewed')
          .$$(`div.product-tile[data-testing-sku="${sku}"]`)
          .first();
  }
}

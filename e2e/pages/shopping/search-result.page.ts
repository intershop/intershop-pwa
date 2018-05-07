import { $$ } from 'protractor';

export class SearchResultPage {
  readonly tag = 'ish-search-result';

  getVisibleProductsCount() {
    return $$('ish-product-tile').count();
  }
}

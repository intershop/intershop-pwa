import { ProductListModule } from './product-list.module';

export class SearchResultPage {
  readonly tag = 'ish-search-result';

  readonly productList = new ProductListModule();
}

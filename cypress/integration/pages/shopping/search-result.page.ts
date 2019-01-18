import { FilterNavigationModule } from './filter-navigation.module';
import { ProductListModule } from './product-list.module';

export class SearchResultPage {
  readonly tag = 'ish-search-result';

  readonly filterNavigation = new FilterNavigationModule();

  readonly productList = new ProductListModule();
}

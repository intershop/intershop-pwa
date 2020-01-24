import { HeaderModule } from '../header.module';

import { FilterNavigationModule } from './filter-navigation.module';
import { ProductListModule } from './product-list.module';

export class SearchResultPage {
  readonly tag = 'ish-search-result';

  readonly header = new HeaderModule();

  readonly filterNavigation = new FilterNavigationModule();

  readonly productList = new ProductListModule('ish-product-listing');

  static navigateTo(term: string, page?: number) {
    cy.visit(`/search/${term}${page ? `?page=${page}` : ''}`);
  }
}

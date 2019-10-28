import { HeaderModule } from '../header.module';

import { ProductListModule } from './product-list.module';

export class FamilyPage {
  readonly tag = 'ish-category-products';

  readonly header = new HeaderModule();

  readonly productList = new ProductListModule('ish-product-list-container');

  static navigateTo(categoryUniqueId: string, page?: number) {
    cy.visit(`/category/${categoryUniqueId}${page ? `?page=${page}` : ''}`);
  }
}

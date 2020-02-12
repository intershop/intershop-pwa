import { HeaderModule } from '../header.module';

import { ProductListModule } from './product-list.module';

export class FamilyPage {
  readonly tag = 'ish-category-products';

  readonly header = new HeaderModule();

  readonly productList = new ProductListModule('ish-product-listing');

  static navigateTo(categoryUniqueId: string, page?: number) {
    cy.visit(`/cat${categoryUniqueId}${page ? `?page=${page}` : ''}`);
  }
}

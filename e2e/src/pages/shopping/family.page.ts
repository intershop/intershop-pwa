import { browser } from 'protractor';

import { HeaderModule } from '../header.module';

import { ProductListModule } from './product-list.module';

export class FamilyPage {
  readonly tag = 'ish-family-page';

  readonly header = new HeaderModule();

  readonly productList = new ProductListModule();

  static navigateTo(categoryUniqueId: string) {
    browser.get(`/category/${categoryUniqueId}`);
  }
}

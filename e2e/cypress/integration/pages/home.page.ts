import { FooterModule } from './footer.module';
import { HeaderModule } from './header.module';
import { MetaDataModule } from './meta-data.module';

export class HomePage {
  readonly tag = 'ish-home-page';

  readonly header = new HeaderModule();
  readonly metaData = new MetaDataModule();
  readonly footer = new FooterModule();

  static navigateTo() {
    cy.visit('/home');
  }

  get content() {
    return cy.get(this.tag);
  }

  get featuredProducts() {
    return cy.get('ish-cms-product-list').find('div.product-tile');
  }

  gotoFeaturedProduct(sku) {
    return cy.get('ish-cms-product-list').find(`div.product-tile[data-testing-sku="${sku}"]`).click();
  }
}

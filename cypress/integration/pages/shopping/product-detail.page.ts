import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class ProductDetailPage {
  readonly tag = 'ish-product-page-container';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  static navigateTo(categoryUniqueId: string, sku: string) {
    cy.visit(`/category/${categoryUniqueId}/product/${sku}`);
  }

  private addToCartButton = () => cy.get('[data-testing-id="addToCartButton"]');
  private addToCompareButton = () => cy.get('[data-testing-id*="compare"]');

  isComplete() {
    return this.addToCartButton().should('be.visible');
  }

  get sku() {
    return cy.get('span[itemprop="sku"]');
  }

  get price() {
    return cy.get('div[data-testing-id="current-price"]');
  }

  addProductToCompare() {
    this.addToCompareButton().click();
  }

  addProductToCart() {
    cy.wait(1000);
    this.addToCartButton().click();
  }

  get recentlyViewedItems() {
    return cy.get('ish-recently-viewed div.product-tile');
  }

  recentlyViewedItem(sku: string) {
    return this.recentlyViewedItems.filter(`[data-testing-sku="${sku}"]`).first();
  }
}

import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class ProductDetailPage {
  readonly tag = 'ish-product-page-container';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  static navigateTo(sku: string, categoryUniqueId?: string) {
    if (categoryUniqueId) {
      cy.visit(`/category/${categoryUniqueId}/product/${sku}`);
    } else {
      cy.visit(`/product/${sku}`);
    }
  }

  private addToCartButton = () => cy.get('[data-testing-id="addToCartButton"]');
  private addToCompareButton = () => cy.get('[data-testing-id*="compare"]');
  private addToQuoteRequestButton = () => cy.get('[data-testing-id="addToQuoteButton"]');
  private quantityInput = () => cy.get('[data-testing-id="quantity"]');

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

  addProductToQuoteRequest() {
    this.addToQuoteRequestButton().click();
  }

  get recentlyViewedItems() {
    return cy.get('ish-recently-viewed div.product-tile');
  }

  setQuantity(quantity: number) {
    this.quantityInput().clear();
    this.quantityInput().type(quantity.toString());
  }

  recentlyViewedItem(sku: string) {
    return this.recentlyViewedItems.filter(`[data-testing-sku="${sku}"]`).first();
  }
}

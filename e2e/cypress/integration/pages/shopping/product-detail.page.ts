import { performAddToCart, waitLoadingEnd } from '../../framework';
import { AddToOrderTemplateModule } from '../account/add-to-order-template.module';
import { AddToWishlistModule } from '../account/add-to-wishlist.module';
import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';
import { MetaDataModule } from '../meta-data.module';

import { ProductListModule } from './product-list.module';

export class ProductDetailPage {
  readonly tag = 'ish-product-page';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();
  readonly metaData = new MetaDataModule();

  readonly bundleParts = new ProductListModule('ish-product-bundle-parts');
  readonly retailSetParts = new ProductListModule('ish-retail-set-parts');
  readonly variations = new ProductListModule('ish-product-master-variations');

  readonly addToWishlist = new AddToWishlistModule();
  readonly addToOrderTemplate = new AddToOrderTemplateModule();

  static navigateTo(sku: string, categoryUniqueId?: string) {
    if (categoryUniqueId) {
      cy.visit(`/sku${sku}-cat${categoryUniqueId}`);
    } else {
      cy.visit(`/sku${sku}`);
    }
  }

  private addToCartButton = () => cy.get('ish-product-detail').find('[data-testing-id="addToCartButton"]');
  private addToCompareButton() {
    return cy.get('ish-product-detail').find('ish-product-detail-actions [data-testing-id*="compare"] .share-label');
  }
  private addToWishlistButton() {
    return cy.get('ish-product-detail').find('ish-product-detail-actions [data-testing-id*="wishlist"] .share-label');
  }

  private addToOrderTemplateButton() {
    return cy.get('ish-product-detail').find('[data-testing-id="addToOrderTemplateButton"]');
  }

  private addToQuoteRequestButton = () => cy.get('ish-product-detail').find('[data-testing-id="addToQuoteButton"]');

  private quantityInput = () => cy.get('ish-product-detail').find('[data-testing-id="quantity"]');

  isComplete() {
    return this.addToCartButton().should('be.visible');
  }

  get sku() {
    return cy.get('ish-product-detail').find('span[itemprop="sku"]');
  }

  get price() {
    return cy.get('ish-product-detail').find('div[data-testing-id="current-price"]');
  }

  addProductToCompare() {
    this.addToCompareButton().click();
  }

  addProductToOrderTemplate() {
    this.addToOrderTemplateButton().click();
  }

  addProductToCart(): Cypress.Chainable<Cypress.WaitXHR> {
    return performAddToCart(this.addToCartButton);
  }

  addProductToQuoteRequest() {
    waitLoadingEnd(1000);
    this.addToQuoteRequestButton().click();
    waitLoadingEnd(1000);
  }

  addProductToWishlist() {
    this.addToWishlistButton().click();
  }

  setQuantity(quantity: number) {
    this.quantityInput().clear();
    this.quantityInput().type(quantity.toString());
  }

  get recentlyViewedItems() {
    return cy.get('[data-testing-id="recently-viewed"] ish-product-tile');
  }

  recentlyViewedItem(sku: string) {
    return this.recentlyViewedItems.find(`[data-testing-sku="${sku}"]`).first();
  }

  gotoRecentlyViewedViewAll() {
    cy.get('[data-testing-id="recently-viewed"] [data-testing-id=view-all]').click();
  }

  accordionItem(id: string) {
    return cy.get('ish-accordion-item a.accordion-toggle').contains(id);
  }

  changeVariationWithSelect(id: string, value: string) {
    cy.get(`[data-testing-id="${id}"]`).select(value);
  }

  gotoMasterProduct() {
    cy.get('a.all-variations-link').click();
  }
}

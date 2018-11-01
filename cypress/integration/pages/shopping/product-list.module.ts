export class ProductListModule {
  get visibleProducts() {
    return cy.get('ish-product-tile');
  }

  productTile(sku: string) {
    return cy.get(`ish-product-tile div[data-testing-sku="${sku}"]`);
  }

  gotoProductDetailPageBySku(sku: string) {
    cy.get(`ish-product-tile div[data-testing-sku="${sku}"]`).click();
  }

  addProductToCompareBySku(sku: string) {
    cy.get(`ish-product-tile div[data-testing-sku="${sku}"] button.add-to-compare`).click();
  }
}

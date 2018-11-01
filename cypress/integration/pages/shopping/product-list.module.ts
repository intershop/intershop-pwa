export class ProductListModule {
  get visibleProducts() {
    return cy.get('ish-product-tile');
  }

  get firstVisibleProductSKU() {
    return this.visibleProducts
      .eq(0)
      .find('[data-testing-sku]')
      .then(el => el.attr('data-testing-sku'));
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

  get numberOfItems() {
    return cy
      .get('.pagination-total')
      .then(el => el.text())
      .then(text => text.match(new RegExp('([0-9]+)')))
      .then(num => Number.parseInt(num[1], 10));
  }

  get pagingBar() {
    return cy.get('div.product-list-paging', { timeout: 20000 });
  }

  get currentPage() {
    return this.pagingBar.find('a.active').then(el => Number.parseInt(el.text(), 10));
  }
}

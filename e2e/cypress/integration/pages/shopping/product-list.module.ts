import { waitLoadingEnd } from '../../framework';
import { AddToWishlistModule } from '../account/add-to-wishlist.module';

export class ProductListModule {
  readonly addToWishlist = new AddToWishlistModule();
  constructor(private contextSelector: string) {}

  get visibleProducts() {
    return cy.get(this.contextSelector).find('ish-product-item');
  }

  get visibleProductSKUs() {
    return cy
      .get(this.contextSelector)
      .find('ish-product-item [data-testing-sku]')
      .then(array => {
        const skus = [];
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          skus.push(element.getAttribute('data-testing-sku'));
        }
        return skus;
      });
  }

  get firstVisibleProductSKU() {
    return this.visibleProducts
      .eq(0)
      .find('[data-testing-sku]')
      .then(el => el.attr('data-testing-sku'));
  }

  productTile(sku: string) {
    return cy.get(this.contextSelector).find(`ish-product-item div[data-testing-sku="${sku}"]`);
  }

  gotoProductDetailPageBySku(sku: string) {
    cy.get(this.contextSelector)
      .find(`ish-product-item div[data-testing-sku="${sku}"]`)
      .click();
  }

  addProductToCompareBySku(sku: string) {
    cy.get(this.contextSelector)
      .find(`ish-product-item div[data-testing-sku="${sku}"] button.add-to-compare`)
      .click();
  }

  addProductToQuoteRequest(sku: string) {
    cy.get(this.contextSelector)
      .find(`ish-product-item div[data-testing-sku="${sku}"] [data-testing-id="addToQuoteButton"]`)
      .click();
  }

  get numberOfItems() {
    return cy
      .get('.pagination-total')
      .then(el => el.text())
      .then(text => text.match(new RegExp('([0-9]+)')))
      .then(num => parseInt(num[1], 10));
  }

  get pagingBar() {
    return cy.get('.product-list-paging', { timeout: 1000 });
  }

  get currentPage() {
    return this.pagingBar.find('a.active').then(el => parseInt(el.text(), 10));
  }

  makeAllProductsVisible() {
    for (let num = 0; num < 10; num++) {
      cy.scrollTo('bottom');
      waitLoadingEnd();
    }
  }
}

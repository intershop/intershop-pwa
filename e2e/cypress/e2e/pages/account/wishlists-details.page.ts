import { performAddToCart, waitLoadingEnd } from '../../framework';
import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class WishlistsDetailsPage {
  readonly tag = 'ish-account-wishlist-detail-page';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  static navigateToOverviewPage() {
    cy.get('a[data-testing-id="wishlists-link"]').click();
  }

  get listItems() {
    return cy.get('ish-wishlist-line-item');
  }

  get listItemLinks() {
    return this.listItems.find('[data-testing-id="wishlist-product"] a[data-testing-id="product-name-link"]');
  }

  get wishlistTitle() {
    return cy.get('ish-account-wishlist-detail-page').find('h1').invoke('text');
  }

  get wishlistPreferredTextElement() {
    return cy.get('[data-testing-id="preferred-wishlist-text"]');
  }

  getWishlistItemById(id: string) {
    return cy.get('span').contains(id).closest('ish-wishlist-line-item').parent();
  }

  editWishlistDetails(name: string, preferred: boolean) {
    cy.get('[data-testing-id="wishlist-details-edit"] .share-label').click();
    cy.get('ngb-modal-window').find('[data-testing-id="title"]').clear().type(name);
    cy.get('[data-testing-id="preferred"]').uncheck();
    if (preferred) {
      cy.get('[data-testing-id="preferred"]').check();
    }
    cy.get('[data-testing-id="wishlist-dialog-submit"]').click();
    waitLoadingEnd(2000);
  }

  deleteWishlist(id: string) {
    this.getWishlistItemById(id).find('[data-testing-id="delete-wishlist"]').click();
    waitLoadingEnd(2000);
  }

  moveProductToWishlist(productId: string, listName: string) {
    this.getWishlistItemById(productId).find('[data-testing-id="move-wishlist"]').click();
    cy.get(`[data-testing-id="radio-${listName}"]`).check();
    cy.get('ngb-modal-window').find('button[class="btn btn-primary"]').click();
    cy.get('[data-testing-id="wishlist-success-link"] a').click();
    waitLoadingEnd(2000);
  }

  addProductToBasket(productId: string, quantity: number) {
    this.getWishlistItemById(productId).find('[data-testing-id="quantity"]').clear().type(quantity.toString());

    return performAddToCart(() => this.getWishlistItemById(productId).find('[data-testing-id="addToCartButton"]'));
  }
}

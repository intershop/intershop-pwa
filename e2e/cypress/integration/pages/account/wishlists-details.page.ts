import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class WishlistsDetailsPage {
  readonly tag = 'ish-account-wishlist-detail-page';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  static navigateToOverviewPage() {
    cy.get('[href="/account/wishlists"]').first().click();
  }

  get listItems() {
    return cy.get('ish-account-wishlist-detail-line-item');
  }

  get listItemLinks() {
    return this.listItems.find('a[data-testing-id="wishlist-product-link"]');
  }

  get wishlistTitle() {
    return cy.get('ish-account-wishlist-detail-page').find('h1').invoke('text');
  }

  get wishlistPreferredTextElement() {
    return cy.get('[data-testing-id="preferred-wishlist-text"]');
  }

  getWishlistItemById(id: string) {
    return cy.get('span').contains(id).closest('ish-account-wishlist-detail-line-item').parent();
  }

  editWishlistDetails(name: string, preferred: boolean) {
    cy.get('[data-testing-id="wishlist-details-edit"]').click();
    cy.get('ngb-modal-window').find('[data-testing-id="title"]').clear().type(name);
    cy.get('[data-testing-id="preferred"]').uncheck();
    if (preferred) {
      cy.get('[data-testing-id="preferred"]').check();
    }
    cy.get('[data-testing-id="wishlist-dialog-submit"]').click();
    cy.wait(500);
  }

  deleteWishlist(id: string) {
    this.getWishlistItemById(id).find('[data-testing-id="delete-wishlist"]').click();
  }

  moveProductToWishlist(productId: string, listName: string) {
    this.getWishlistItemById(productId).find('[data-testing-id="move-wishlist"]').click();
    cy.get(`[data-testing-id="${listName}"]`).check();
    cy.get('ngb-modal-window').find('button[class="btn btn-primary"]').click();
    cy.get('[data-testing-id="wishlist-success-link"] a').click();
  }

  addProductToBasket(productId: string, quantity: number) {
    this.getWishlistItemById(productId).find('[data-testing-id="quantity"]').clear().type(quantity.toString());

    cy.wait(3000);
    cy.server().route('POST', '**/baskets/*/items').as('basket');
    cy.server().route('GET', '**/baskets/current*').as('basketCurrent');
    cy.wait(3000);

    this.getWishlistItemById(productId).find('[data-testing-id="addToCartButton"]').click();

    return cy
      .wait('@basket')
      .then(result => (result.status >= 400 ? result : cy.wait('@basketCurrent').then(() => result))) as any;
  }
}

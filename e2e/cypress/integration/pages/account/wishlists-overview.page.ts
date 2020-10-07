import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class WishlistsOverviewPage {
  readonly tag = 'ish-account-wishlist-page';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  addWishlist(name: string, preferred: boolean) {
    cy.get('a[data-testing-id="add-wishlist"').click();
    cy.get('[data-testing-id="wishlist-dialog-name"]').find('[data-testing-id="title"]').clear().type(name);
    if (preferred) {
      cy.get('[data-testing-id="wishlist-dialog-preferred"]').find('[data-testing-id="preferred"]').check();
    }
    cy.get('[data-testing-id="wishlist-dialog-submit"]').click();
  }

  deleteWishlistById(id: string) {
    this.wishlistsArray
      .find('a')
      .contains(id)
      .closest('[data-testing-id="wishlist-list-item-container"]')
      .find('[data-testing-id="delete-wishlist"]')
      .click();
    cy.get('[data-testing-id="confirm"]').click();
  }

  goToWishlistDetailLink(name: string) {
    cy.get('a').contains(name).click();
  }

  get wishlistsArray() {
    return cy.get('[data-testing-id="wishlist-list-item"]');
  }

  get wishlistsTitlesArray() {
    return this.wishlistsArray.find('[data-testing-id="wishlist-list-title"]').invoke('text');
  }
}

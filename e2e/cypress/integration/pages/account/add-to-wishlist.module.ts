export class AddToWishlistModule {
  constructor(private contextSelector: string = 'ish-product-listing') {}

  addProductToWishlistFromPage(title: string = '', modal: boolean = false) {
    if (modal) {
      cy.get(`[data-testing-id="${title}"]`).click();
      cy.get('.modal-footer button.btn-primary').click();
    }
    this.closeAddProductToWishlistModal('link');
  }

  addProductToWishlistFromList(product: string, title: string, modal: boolean = true) {
    if (modal) {
      cy.get(this.contextSelector)
        .find(`ish-product-item div[data-testing-sku="${product}"] button.add-to-wishlist`)
        .click();
      cy.get(`[data-testing-id="${title}"]`).click();
      cy.get('.modal-footer button.btn-primary').click();
      this.closeAddProductToWishlistModal('link');
    } else {
      cy.get(this.contextSelector)
        .find(`ish-product-item div[data-testing-sku="${product}"] button.add-to-wishlist`)
        .click();
      this.closeAddProductToWishlistModal('link');
    }
  }

  private closeAddProductToWishlistModal(mode: 'link' | 'x') {
    cy.wait(500);
    mode === 'link'
      ? cy.get('[data-testing-id="wishlist-success-link"] a').click()
      : cy.get('.modal-header button').click();
  }
}

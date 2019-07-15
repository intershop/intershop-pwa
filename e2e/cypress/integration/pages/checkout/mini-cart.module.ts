export class MiniCartModule {
  readonly selector = 'ish-mini-basket-container[data-testing-id="mini-basket-desktop"]';

  private miniBasketLink = () => cy.get(this.selector).find('.quick-cart-link.d-md-block');

  get total() {
    return this.miniBasketLink()
      .find('.mini-cart-price')
      .then(el => el.text());
  }

  goToCart() {
    this.miniBasketLink().click();
    cy.wait(3000);
    this.miniBasketLink()
      .find('.view-cart')
      .should('be.visible')
      .click();
  }

  get text() {
    return this.miniBasketLink().then(el => el.text());
  }
}

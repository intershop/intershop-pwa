export class MiniCartModule {
  private readonly selector = 'ish-mini-basket[data-testing-id="mini-basket-desktop"]';

  private miniBasketLink = () => cy.get(this.selector).find('.quick-cart-link.d-md-block');
  private viewCartButton = () =>
    this.miniBasketLink()
      .find('.view-cart')
      // tslint:disable-next-line: semicolon
      .should('be.visible');

  get total() {
    return this.miniBasketLink()
      .find('.mini-cart-price')
      .then(el => el.text());
  }

  get error() {
    return this.miniBasketLink()
      .find('.text-danger')
      .then(el => el.text());
  }

  goToCart() {
    this.miniBasketLink().then(miniBasket => {
      if (miniBasket.hasClass('mini-cart-active')) {
        this.viewCartButton().click();
      } else {
        this.miniBasketLink().click();
        cy.wait(3000);
        this.viewCartButton().click();
      }
    });
  }

  get text() {
    return this.miniBasketLink().then(el => el.text());
  }
}

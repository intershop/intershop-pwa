export class MiniCartModule {
  private readonly selector = 'ish-mini-basket[data-testing-id="mini-basket-desktop"]';

  private miniBasketLink = () => cy.get(this.selector).find('.quick-cart-link.d-md-block');
  private viewCartButton = () => cy.get('a[href="/basket"]:visible').eq(0);

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
    this.viewCartButton().click();
  }

  get text() {
    return this.miniBasketLink().then(el => el.text());
  }
}

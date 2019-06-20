export class MiniCartModule {
  get total() {
    return cy.get('ish-mini-basket').get('.mini-cart-price');
  }

  goToCart() {
    cy.get('ish-mini-basket')
      .get('.quick-cart-link')
      .click();

    cy.get('a.view-cart', { timeout: 2000 }).click();
  }

  get text() {
    return cy.get('ish-mini-basket').get('.quick-cart-link');
  }
}

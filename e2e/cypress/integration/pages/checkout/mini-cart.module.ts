export class MiniCartModule {
  get total() {
    return cy
      .get('ish-mini-basket')
      .get('span.mini-cart-price')
      .should('be.visible')
      .last();
  }

  goToCart() {
    cy.get('ish-mini-basket')
      .get('div.quick-cart-link')
      .first()
      .click({ force: true });

    cy.get('a.view-cart', { timeout: 2000 })
      .first()
      .click({ force: true });
  }

  get text() {
    return cy
      .get('ish-mini-basket')
      .get('div.quick-cart-link')
      .first();
  }
}

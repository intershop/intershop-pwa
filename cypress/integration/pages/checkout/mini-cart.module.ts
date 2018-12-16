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
      .click();

    cy.get('a.view-cart', { timeout: 10000 })
      .should('be.visible')
      .first()
      .click();
  }
}

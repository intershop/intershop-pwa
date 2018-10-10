export class MiniCartModule {
  get total() {
    return cy
      .get('ish-mini-basket')
      .get('span.mini-cart-price')
      .should('be.visible')
      .last();
  }

  goToCart() {
    // cy.get('ish-mini-basket').then(cart => {
    //   if (cart.find('div.collapse').length) {
    //     cart.find('div.quick-cart-link').click();
    //   }
    // });
    cy.get('ish-mini-basket')
      .get('div.quick-cart-link')
      .eq(2)
      .click();

    cy.get('a.view-cart', { timeout: 10000 })
      .should('be.visible')
      .eq(2)
      .click();
  }
}

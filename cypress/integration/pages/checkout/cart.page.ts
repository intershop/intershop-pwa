export class CartPage {
  readonly tag = 'ish-shopping-basket';

  beginCheckout() {
    cy.wait(1000);
    cy.get(this.tag)
      .find('button')
      .contains('Checkout')
      .click();
  }
}

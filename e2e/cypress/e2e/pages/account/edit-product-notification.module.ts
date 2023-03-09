export class EditProductNotificationModule {
  private priceInput = () => cy.get('ish-fieldset-field').find('[data-testing-id="priceValue"]');

  private emailInput = () => cy.get('ish-fieldset-field').find('[data-testing-id="email"]');

  editPriceNotification(price: number, email: string) {
    this.priceInput().clear();
    this.priceInput().type(price.toString());
    this.emailInput().clear();
    this.emailInput().type(email);
    cy.get('.modal-footer button.btn-primary').click();
  }

  editStockNotification(email: string) {
    this.emailInput().clear();
    this.emailInput().type(email);
    cy.get('.modal-footer button.btn-primary').click();
  }
}

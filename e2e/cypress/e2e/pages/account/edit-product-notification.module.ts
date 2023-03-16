export class EditProductNotificationModule {
  private priceInput = () => cy.get('ish-fieldset-field').find('[data-testing-id="pricevalue"]');

  private emailInput = () => cy.get('ish-fieldset-field').find('[data-testing-id="email"]');

  editPriceNotification(price: number, email: string) {
    this.priceInput().clear();
    this.priceInput().type(price.toString());
    this.emailInput().clear();
    this.emailInput().type(email);
    cy.get('.modal-footer button.btn-primary').click();
  }
}

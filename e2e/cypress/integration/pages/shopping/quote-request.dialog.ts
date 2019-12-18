export class QuoteRequestDialog {
  readonly tag = 'ish-product-add-to-quote-dialog';

  private saveQuoteRequestButton = () => cy.get('[data-testing-id="saveQuoteRequest"]');
  private submitQuoteRequestButton = () => cy.get('[data-testing-id="submitQuoteRequest"]');
  private quantityInput = () => cy.get('[data-testing-id="quantity"]');

  saveQuoteRequest() {
    this.saveQuoteRequestButton().click();
  }

  submitQuoteRequest() {
    this.submitQuoteRequestButton().click();
  }

  setQuantity(quantity: number) {
    this.quantityInput().type(quantity.toString());
  }
}

export class ReviewPage {
  readonly tag = 'ish-checkout-review-page-container';

  acceptTAC() {
    cy.get('input[data-testing-id="termsAndConditions"]').check();
  }

  submitOrder() {
    cy.get('button')
      .contains('Submit Order')
      .click();
  }
}

export class CheckoutReviewPage {
  readonly tag = 'ish-checkout-review-page';

  acceptTAC() {
    cy.get('input[data-testing-id="termsAndConditions"]').check();
  }

  submitOrder() {
    cy.get('button')
      .contains('Submit Order')
      .click();
  }
}

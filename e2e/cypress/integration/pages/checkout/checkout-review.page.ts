import { waitLoadingEnd } from '../../framework';

export class CheckoutReviewPage {
  readonly tag = 'ish-checkout-review-page';

  acceptTAC() {
    cy.get('input[data-testing-id="termsAndConditions"]').check();
    waitLoadingEnd(1000);
  }

  submitOrder() {
    waitLoadingEnd(1000);
    cy.get('button').contains('Submit Order').click();
    waitLoadingEnd(1000);
  }
}

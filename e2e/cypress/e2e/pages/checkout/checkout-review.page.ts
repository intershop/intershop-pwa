import { waitLoadingEnd } from '../../framework';

export class CheckoutReviewPage {
  readonly tag = 'ish-checkout-review-page';

  acceptTAC() {
    cy.get('input[data-testing-id="termsAndConditions"]').check();
    waitLoadingEnd(1000);
  }

  get costCenterInformation() {
    return cy.get('div[data-testing-id="buyer-cost-center"');
  }

  submitOrder() {
    waitLoadingEnd(1000);
    cy.get('button').contains('Submit order').click();
    waitLoadingEnd(1000);
  }

  lineItemWarranty() {
    return cy.get('ish-line-item-list-element').find('ish-line-item-warranty');
  }
}

import { waitLoadingEnd } from '../../framework';

export class PaymentPage {
  readonly tag = 'ish-checkout-payment-page-container';

  selectPayment(payment: 'INVOICE' | 'CASH_ON_DELIVERY' | 'CASH_IN_ADVANCE') {
    cy.get(this.tag)
      .find(`#paymentOption_ISH_${payment}`)
      .check();
    cy.wait(3000);
    waitLoadingEnd();
  }

  continueCheckout() {
    cy.get('button')
      .contains('Continue Checkout')
      .click();
  }
}

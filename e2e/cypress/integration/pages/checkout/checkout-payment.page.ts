import { fillFormField, waitLoadingEnd } from '../../framework';

export class CheckoutPaymentPage {
  readonly tag = 'ish-checkout-payment-page';

  get content() {
    return cy.get(this.tag);
  }

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

  addPaymentInstrument(method: string) {
    cy.get(`[data-testing-id=payment-parameter-form-${method}] a`).click();
  }

  paymentInstrument(method: string) {
    return {
      fillForm(params: { [key: string]: string }) {
        Object.keys(params).forEach(key =>
          fillFormField(`[data-testing-id=payment-parameter-form-${method}]`, key, params[key])
        );
      },

      submit() {
        cy.get(`[data-testing-id=payment-parameter-form-${method}]`)
          .find('[type="submit"]')
          .click();
      },

      formError(key: string) {
        return cy
          .get(`[data-testing-id=payment-parameter-form-${method}]`)
          .find(`[data-testing-id='${key}']`)
          .next();
      },
    };
  }
}

import { fillFormField, waitLoadingEnd } from '../../framework';
import { HeaderModule } from '../header.module';

export class CheckoutPaymentPage {
  readonly tag = 'ish-checkout-payment-page';
  readonly header = new HeaderModule();

  get content() {
    return cy.get(this.tag);
  }

  get saveForLaterCheckbox() {
    return cy.get(this.tag).find('ish-checkbox input[data-testing-id="saveForLater"]');
  }

  selectPayment(payment: 'INVOICE' | 'CASH_ON_DELIVERY' | 'CASH_IN_ADVANCE') {
    cy.get(this.tag).find(`#paymentOption_ISH_${payment}`).check();
    cy.wait(3000);
    waitLoadingEnd();
  }

  continueCheckout() {
    cy.get('button').contains('Continue Checkout').click();
  }

  addPaymentInstrument(method: string) {
    cy.get(`[data-testing-id=payment-parameter-form-${method}] a[data-testing-id="add-payment-link"]`).click();
  }

  paymentInstrument(method: string) {
    return {
      fillForm(params: { [key: string]: string }) {
        Object.keys(params).forEach(key =>
          fillFormField(`[data-testing-id=payment-parameter-form-${method}]`, key, params[key])
        );
      },

      uncheckSaveForLater() {
        cy.get(`[data-testing-id=payment-parameter-form-${method}]`).find('[data-testing-id=saveForLater]').uncheck();
      },

      submit() {
        cy.get(`[data-testing-id=payment-parameter-form-${method}]`).find('[type="submit"]').click();
      },

      delete() {
        cy.get(`[data-testing-id=payment-parameter-form-${method}]`)
          .find('a[data-testing-id=delete-payment-link]')
          .first()
          .click();
      },

      formError(key: string) {
        return cy
          .get(`[data-testing-id=payment-parameter-form-${method}]`)
          .find(`[data-testing-id='${key}']`)
          .parent()
          .next();
      },
    };
  }
}

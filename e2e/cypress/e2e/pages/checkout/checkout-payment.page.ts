import { fillFormField, waitLoadingEnd } from '../../framework';
import { HeaderModule } from '../header.module';

export class CheckoutPaymentPage {
  readonly tag = 'ish-checkout-payment-page';
  readonly header = new HeaderModule();

  get content() {
    return cy.get(this.tag);
  }

  get saveForLaterCheckbox() {
    return cy.get(this.tag).find('input[data-testing-id="saveForLater"]');
  }

  selectPayment(payment: 'INVOICE' | 'CASH_ON_DELIVERY' | 'CASH_IN_ADVANCE') {
    cy.get(this.tag).find(`#paymentOption_ISH_${payment}`).check();
    cy.wait(3000);
    waitLoadingEnd();
  }

  continueCheckout() {
    cy.get('button').contains('Continue checkout').click();
  }

  addPaymentInstrument(method: string) {
    waitLoadingEnd(1000);
    cy.get(`[data-testing-id=payment-parameter-form-${method}] button[data-testing-id="add-payment-link"]`).click();
    waitLoadingEnd(1000);
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
        waitLoadingEnd(3000);
      },

      delete() {
        cy.get(`[data-testing-id=payment-parameter-form-${method}]`)
          .find('button[data-testing-id=delete-payment-link]')
          .first()
          .click();
        waitLoadingEnd(3000);
      },

      formError(key: string) {
        return cy
          .get(`[data-testing-id=payment-parameter-form-${method}]`)
          .find(`[data-testing-id='${key}']`)
          .parent()
          .parent()
          .get('ish-validation-message');
      },
    };
  }
}

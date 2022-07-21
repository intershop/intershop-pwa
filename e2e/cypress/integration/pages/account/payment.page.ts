import { waitLoadingEnd } from '../../framework';
import { HeaderModule } from '../header.module';

export class PaymentPage {
  readonly tag = 'ish-account-payment';

  readonly header = new HeaderModule();

  get content() {
    return cy.get(this.tag);
  }

  get preferredPaymentMethod() {
    return cy.get(this.tag).find('[data-testing-id="preferred-payment-method"]');
  }

  get noPreferredPaymentOption() {
    return cy.get(this.tag).find('#paymentOption_empty');
  }

  static navigateTo() {
    cy.visit('/account/payment');
  }

  selectPayment(payment: 'INVOICE' | 'CASH_ON_DELIVERY' | 'CASH_IN_ADVANCE') {
    cy.get(this.tag).find(`#paymentOption_ISH_${payment}`).check();
    cy.wait(1500);
    waitLoadingEnd();
  }

  selectCreditCard() {
    cy.get(this.tag).find('div[data-testing-id="paymentMethodList"] input').first().check();
    cy.wait(1500);
    waitLoadingEnd();
  }

  selectNoPreferredPayment() {
    this.noPreferredPaymentOption.check();
    cy.wait(1500);
    waitLoadingEnd();
  }
}

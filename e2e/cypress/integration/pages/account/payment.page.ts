import { HeaderModule } from '../header.module';

export class PaymentPage {
  readonly tag = 'ish-account-payment';

  readonly header = new HeaderModule();

  get content() {
    return cy.get(this.tag);
  }

  static navigateTo() {
    cy.visit('/account/payment');
  }
}

export class ContactConfirmationPage {
  readonly tag = 'ish-contact-confirmation';

  get getText() {
    return cy.get('[data-testing-id="successText"], .alert-danger');
  }
}

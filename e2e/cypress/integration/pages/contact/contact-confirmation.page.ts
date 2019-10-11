export class ContactConfirmationPage {
  readonly tag = 'ish-contact-confirmation';

  get successText() {
    return cy.get('[data-testing-id="successText"]');
  }
}

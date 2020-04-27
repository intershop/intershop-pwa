import { fillFormField } from '../../framework';

export class ProfileEditEmailPage {
  readonly tag = 'ish-account-profile-email-page';

  fillForm(data: { email: string; emailConfirmation?: string }) {
    fillFormField(this.tag, 'email', data.email);
    fillFormField(this.tag, 'emailConfirmation', data.emailConfirmation || data.email);
    return this;
  }

  submit() {
    cy.server()
      .route('PUT', '**/customers/**')
      .as('customers');
    cy.wait(500);

    cy.get(this.tag)
      .find('button[type="submit"]')
      .click();

    return cy.wait('@customers');
  }
}

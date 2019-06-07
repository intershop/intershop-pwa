import { fillFormField } from '../../framework';

export class ProfileEditPasswordPage {
  readonly tag = 'ish-account-profile-password-page-container';

  fillForm(data: { password: string; passwordConfirmation?: string }) {
    fillFormField(this.tag, 'password', data.password);
    fillFormField(this.tag, 'passwordConfirmation', data.passwordConfirmation || data.password);
    return this;
  }

  submit() {
    cy.server();
    cy.route('PUT', '**/customers/**').as('customers');
    cy.wait(500);

    cy.get(this.tag)
      .find('button[type="submit"]')
      .click();

    return cy.wait('@customers');
  }
}

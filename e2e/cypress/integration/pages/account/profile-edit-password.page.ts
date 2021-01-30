import { fillFormField } from '../../framework';

export class ProfileEditPasswordPage {
  readonly tag = 'ish-account-profile-password-page';

  fillForm(data: { currentPassword: string; password: string; passwordConfirmation?: string }) {
    fillFormField(this.tag, 'currentPassword', data.currentPassword);
    fillFormField(this.tag, 'password', data.password);
    fillFormField(this.tag, 'passwordConfirmation', data.passwordConfirmation || data.password);
    return this;
  }

  submit() {
    cy.intercept('PUT', '**/password').as('passwordChange');
    cy.wait(500);

    cy.get(this.tag).find('button[type="submit"]').click();

    return cy.wait('@passwordChange');
  }
}

import { fillFormField } from '../../framework';

export class ProfileEditDetailsPage {
  readonly tag = 'ish-account-profile-user-page';

  fillForm(data: { firstName?: string; lastName?: string; phoneHome?: string; preferredLanguage?: string }) {
    Object.keys(data).forEach(key => fillFormField(this.tag, key, data[key]));
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

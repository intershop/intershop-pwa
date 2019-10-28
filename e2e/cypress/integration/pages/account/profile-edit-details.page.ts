import { fillFormField } from '../../framework';

import { Registration } from './registration.page';

export type ProfileEditDetailsTypes = Partial<
  Pick<Registration, 'title' | 'firstName' | 'lastName' | 'phoneHome' | 'preferredLanguage'>
>;

export class ProfileEditDetailsPage {
  readonly tag = 'ish-account-profile-user';

  fillForm(data: ProfileEditDetailsTypes) {
    Object.keys(data).forEach(key => fillFormField(this.tag, key, data[key]));
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

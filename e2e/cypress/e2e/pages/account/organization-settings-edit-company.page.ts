import { fillFormField } from '../../framework';

export type OrganizationSettingsEditCompanyTypes = Partial<
  Record<'companyName' | 'companyName2' | 'taxationID', string>
>;

export class OrganizationSettingsEditCompanyPage {
  readonly tag = 'ish-account-profile-company';

  fillForm(data: OrganizationSettingsEditCompanyTypes) {
    Object.keys(data).forEach(key => fillFormField(this.tag, key, data[key]));
    return this;
  }

  submit() {
    cy.intercept('PUT', '**/customers/**').as('customers');
    cy.wait(500);

    cy.get(this.tag).find('button[type="submit"]').click();

    return cy.wait('@customers');
  }
}

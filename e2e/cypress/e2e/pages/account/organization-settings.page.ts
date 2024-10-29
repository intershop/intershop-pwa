import { HeaderModule } from '../header.module';

export class OrganizationSettingsPage {
  readonly tag = 'ish-organization-settings-page';

  readonly header = new HeaderModule();

  editCompanyDetails() {
    cy.get('[data-testing-id="edit-company"]').click();
  }

  get companyName() {
    return cy.get(this.tag).find('[data-testing-id="company-field"]');
  }

  get taxationId() {
    return cy.get(this.tag).find('[data-testing-id="taxation-id-field"]');
  }
}

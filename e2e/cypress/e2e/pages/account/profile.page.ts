import { HeaderModule } from '../header.module';

export class ProfilePage {
  readonly tag = 'ish-account-profile';

  readonly header = new HeaderModule();

  editEmail() {
    cy.get('[data-testing-id="edit-email"]').click();
  }

  editPassword() {
    cy.get('[data-testing-id="edit-password"]').click();
  }

  editDetails() {
    cy.get('[data-testing-id="edit-user"]').click();
  }

  get email() {
    return cy.get(this.tag).find('[data-testing-id="email-field"]');
  }

  get name() {
    return cy.get(this.tag).find('[data-testing-id="name-field"]');
  }

  get phone() {
    return cy.get(this.tag).find('[data-testing-id="phone-field"]');
  }

  get title() {
    return cy.get(this.tag).find('h1');
  }
}

import { HeaderModule } from '../header.module';

export class UsersDetailPage {
  readonly tag = 'ish-user-detail-page';

  readonly header = new HeaderModule();

  get name() {
    return cy.get(this.tag).find('[data-testing-id="name-field"]');
  }

  get email() {
    return cy.get(this.tag).find('[data-testing-id="email-field"]');
  }

  editUser() {
    return cy.get('[data-testing-id="edit-user"]').click();
  }

  goToUserManagement() {
    cy.get('[data-testing-id="back-to-user-management"]').click();
  }
}

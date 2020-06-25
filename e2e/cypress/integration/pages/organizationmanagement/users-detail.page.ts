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

  editRoles() {
    return cy.get('[data-testing-id="edit-roles"]').click();
  }

  editBudget() {
    return cy.get('[data-testing-id="edit-budget"]').click();
  }

  goToUserManagement() {
    cy.get('[data-testing-id="back-to-user-management"]').click();
  }

  get rolesAndPermissions() {
    return cy.get(this.tag).find('[data-testing-id="user-roles-fields"]');
  }

  get orderSpendLimit() {
    return cy.get(this.tag).find('[data-testing-id="order-spend-limit-field"]');
  }

  get budget() {
    return cy.get(this.tag).find('[data-testing-id="budget-field"]');
  }

  get userBudgets() {
    return cy.get(this.tag).find('[data-testing-id="user-budgets"]');
  }
}

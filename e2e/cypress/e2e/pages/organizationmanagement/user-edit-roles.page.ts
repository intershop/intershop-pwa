export class UserEditRolesPage {
  readonly tag = 'ish-user-edit-roles-page';

  private submitButton = () => cy.get('[data-testing-id="edit-roles-submit"]');

  checkRole(val: string) {
    cy.get(this.tag).contains('label', val).find('input[type="checkbox"]').check();
  }

  submit() {
    this.submitButton().click();
  }
}

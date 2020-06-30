import { HeaderModule } from '../header.module';

export class UsersPage {
  readonly tag = 'ish-users-page';

  readonly header = new HeaderModule();

  static navigateTo() {
    cy.visit('/account/organization/users');
  }

  get usersList() {
    return cy.get('div[data-testing-id="user-list"]');
  }

  goToUserDetailLink(id: string) {
    cy.get(`a[href="/account/organization/users/${id}"]`).first().click();
  }
}

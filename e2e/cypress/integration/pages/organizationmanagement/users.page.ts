import { waitLoadingEnd } from '../../framework';
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

  goToUser(name: string) {
    this.usersList.find('a').contains(name).click();
  }

  goToUserDetailLink(id: string) {
    cy.get(`a[href="/account/organization/users/${id}"]`).first().click();
  }

  addUser() {
    cy.get('a[data-testing-id="add-user-link"]').click();
  }

  deleteUser(name: string) {
    cy.get(this.tag).contains('div.list-item-row', name).find('[data-testing-id="remove-user"]').click();
    cy.get('[data-testing-id="confirm"]', { timeout: 2000 }).click();
    waitLoadingEnd(2000);
  }

  rolesOfUser(id: string) {
    return cy.get(`[data-testing-id="user-roles-${id}"]`);
  }

  hoverUserBudgetProgressBar(id: string) {
    cy.get(`[data-testing-id="user-budget-${id}"]`)
      .find('[data-testing-id="user-budget-popover"]')
      .trigger('mouseover');
  }

  getUserBudgetPopover(id: string) {
    return cy.get(`[data-testing-id="user-budget-${id}"]`).find('[data-testing-id="user-budget-popover"]');
  }
}

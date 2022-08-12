import { waitLoadingEnd } from '../../framework';
import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class PunchoutOverviewPage {
  readonly tag = 'ish-account-punchout-page';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  get page() {
    return cy.get(this.tag);
  }

  get headerNavigation() {
    return cy.get('ish-account-punchout-header').find('ul.nav-tabs');
  }

  get userList() {
    return cy.get('div[data-testing-id="user-list"]');
  }

  get emptyList() {
    return cy.get(this.tag).find('[data-testing-id="empty-user-list"]');
  }

  get successMessage() {
    return {
      message: cy.get('#toast-container').find('.toast-message'),
    };
  }

  selectcXMLTab() {
    this.headerNavigation.find('li:first-child a').click();
  }

  selectOciTab() {
    this.headerNavigation.find('li:last-child a').click();
  }

  addUser() {
    cy.get('a[data-testing-id="add-user-button"]').click();
  }

  editUser(login: string) {
    cy.get(this.tag).contains('div.list-item-row', login).find('[data-testing-id="edit-user"]').click();
  }

  deleteUser(login: string) {
    cy.get(this.tag).contains('div.list-item-row', login).find('[data-testing-id="delete-user"]').click();
    cy.get('[data-testing-id="confirm"]', { timeout: 2000 }).click();
    waitLoadingEnd(2000);
  }
}

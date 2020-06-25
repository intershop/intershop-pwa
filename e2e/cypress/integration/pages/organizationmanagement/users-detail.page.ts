import { HeaderModule } from '../header.module';

export class UsersDetailPage {
  readonly tag = 'ish-users-detail-page';

  readonly header = new HeaderModule();

  get name() {
    return cy.get(this.tag).find('[data-testing-id="name-field"]');
  }

  get email() {
    return cy.get(this.tag).find('[data-testing-id="email-field"]');
  }
}

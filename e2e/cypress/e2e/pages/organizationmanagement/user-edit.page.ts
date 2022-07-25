import { fillFormField } from '../../framework';

export class UserEditPage {
  readonly tag = 'ish-user-edit-profile-page';

  private submitButton = () => cy.get('[data-testing-id="edit-user-submit"]');

  editTitle(val: string) {
    fillFormField(this.tag, 'title', val);
  }

  editFirstName(val: string) {
    fillFormField(this.tag, 'firstName', val);
  }

  submit() {
    this.submitButton().click();
  }
}

import { fillFormField } from '../../framework';

declare interface PunchoutUserCreateForm {
  login: string;
  password: string;
  passwordConfirmation: string;
}

export class PunchoutCreatePage {
  readonly tag = 'ish-account-punchout-create-page';

  private submitButton = () => cy.get('[data-testing-id="create-punchout-user-submit"]');

  fillForm(content: PunchoutUserCreateForm) {
    Object.keys(content)
      .filter(key => content[key] !== undefined)
      .forEach((key: keyof PunchoutUserCreateForm) => {
        fillFormField(this.tag, key, content[key]);
      });

    return this;
  }

  submit() {
    this.submitButton().click();
  }
}

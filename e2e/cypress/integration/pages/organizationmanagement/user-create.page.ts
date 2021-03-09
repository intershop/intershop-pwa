import { fillFormField } from '../../framework';

declare interface B2BUserCreateForm {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneHome: string;
}

export class UserCreatePage {
  readonly tag = 'ish-user-create-page';

  private submitButton = () => cy.get('[data-testing-id="create-user-submit"]');

  fillForm(content: B2BUserCreateForm) {
    Object.keys(content)
      .filter(key => content[key] !== undefined)
      .forEach((key: keyof B2BUserCreateForm) => {
        fillFormField(this.tag, key, content[key]);
      });

    return this;
  }

  submit() {
    this.submitButton().click();
  }
}

import { fillFormField } from '../../framework';

declare interface B2BUserBudgetForm {
  budget: number;
  orderSpentLimit: number;
  budgetPeriod: string;
}

export class UserEditBudgetPage {
  readonly tag = 'ish-user-edit-budget-page';

  private submitButton = () => cy.get('[data-testing-id="edit-budget-submit"]');

  fillForm(content: B2BUserBudgetForm) {
    Object.keys(content)
      .filter(key => content[key] !== undefined)
      .forEach((key: keyof B2BUserBudgetForm) => {
        fillFormField(this.tag, key, content[key]);
      });

    return this;
  }

  submit() {
    this.submitButton().click();
  }
}

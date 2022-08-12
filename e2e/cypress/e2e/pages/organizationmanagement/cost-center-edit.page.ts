import { fillFormField } from '../../framework';

export class CostCenterEditPage {
  readonly tag = 'ish-cost-center-edit-page';

  private submitButton = () => cy.get('[data-testing-id="edit-cost-center-submit"]');

  editName(val: string) {
    fillFormField(this.tag, 'name', val);
  }

  editBudgetValue(val: string) {
    fillFormField(this.tag, 'budgetValue', val);
  }

  submit() {
    this.submitButton().click();
  }
}

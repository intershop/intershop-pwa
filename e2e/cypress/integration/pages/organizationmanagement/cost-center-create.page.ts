import { fillFormField } from '../../framework';

declare interface CostCenterCreateForm {
  costCenterId: string;
  name: string;
  budgetValue: number;
  budgetPeriod: string;
  costCenterManager: string;
}

export class CostCenterCreatePage {
  readonly tag = 'ish-cost-center-create-page';

  private submitButton = () => cy.get('[data-testing-id="create-cost-center-submit"]');

  fillForm(content: CostCenterCreateForm) {
    Object.keys(content)
      .filter(key => content[key] !== undefined)
      .forEach((key: keyof CostCenterCreateForm) => {
        fillFormField(this.tag, key, content[key]);
      });

    return this;
  }

  submit() {
    this.submitButton().click();
  }
}

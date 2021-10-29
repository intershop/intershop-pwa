export class CostCenterBuyersPage {
  readonly tag = 'ish-cost-center-buyers-page';

  private submitButton = () => cy.get('[data-testing-id="add-buyers-submit"]');

  checkBuyer() {
    cy.get(this.tag).find('.list-body input[type="checkbox"]').check();
  }

  submit() {
    this.submitButton().click();
  }
}

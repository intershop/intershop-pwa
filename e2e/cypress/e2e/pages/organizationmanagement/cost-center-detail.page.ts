import { HeaderModule } from '../header.module';

export class CostCenterDetailPage {
  readonly tag = 'ish-cost-center-detail-page';

  readonly header = new HeaderModule();

  get id() {
    return cy.get(this.tag).find('[data-testing-id="id-field"]');
  }

  get name() {
    return cy.get(this.tag).find('[data-testing-id="name-field"]');
  }

  get owner() {
    return cy.get(this.tag).find('[data-testing-id="owner-field"]');
  }

  get emptyBuyerList() {
    return cy.get(this.tag).find('[data-testing-id="emptyBuyerList"]');
  }

  get buyerList() {
    return cy.get(this.tag).find('[data-testing-id="costCenterBuyers-list"]');
  }

  editCostCenter() {
    return cy.get('[data-testing-id="edit-cost-center"]').click();
  }

  addBuyers() {
    return cy.get('[data-testing-id="add-cost-center-buyers"]').click();
  }

  editBuyerBudget(name: string, budgetValue: number) {
    cy.get(this.tag).contains('.cdk-row', name).find('[data-testing-id="cost-center-buyer-edit"]').click();
    cy.get('[data-testing-id="budgetValue"]').clear().type(budgetValue.toString());
    cy.get('[data-testing-id="cost-center-buyer-edit-dialog-submit"]').click();
    cy.wait(1000);
  }

  removeBuyer(name: string) {
    cy.get(this.tag).contains('.cdk-row', name).find('[data-testing-id="cost-center-buyer-remove"]').click();
    cy.wait(1000);
  }

  goToCostCenterManagement() {
    cy.get('[data-testing-id="back-to-cost-center-management"]').click();
  }
}

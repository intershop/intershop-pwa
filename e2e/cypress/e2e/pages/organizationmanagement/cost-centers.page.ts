import { waitLoadingEnd } from '../../framework';
import { HeaderModule } from '../header.module';

export class CostCentersPage {
  readonly tag = 'ish-cost-centers-page';

  readonly header = new HeaderModule();

  static navigateTo() {
    cy.visit('/account/organization/cost-centers');
  }

  get costCentersList() {
    return cy.get('[data-testing-id="costCenter-list"]');
  }

  get emptyList() {
    return cy.get(this.tag).find('[data-testing-id="emptyList"]');
  }

  addCostCenter() {
    cy.get('a[data-testing-id="add-cost-center-link"]').click();
  }

  deactivateCostcenter(name: string) {
    cy.get(this.tag).contains('.cdk-row', name).find('[data-testing-id="deactivate-cost-center"]').click();
    cy.get('[data-testing-id="confirm"]', { timeout: 1000 }).click();
    waitLoadingEnd(1000);
  }

  deleteCostCenter(name: string) {
    cy.get(this.tag).contains('.cdk-row', name).find('[data-testing-id="delete-cost-center"]').click();
    cy.get('[data-testing-id="confirm"]', { timeout: 1000 }).click();
    waitLoadingEnd(1000);
  }
}

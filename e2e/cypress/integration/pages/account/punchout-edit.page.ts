import { waitLoadingEnd } from '../../framework';

export class PunchoutEditPage {
  readonly tag = 'ish-account-punchout-details-page';

  private submitButton = () => cy.get('[data-testing-id="update-punchout-user-submit"]');

  editActiveFlag(active: boolean) {
    cy.get('[data-testing-id="active"]').uncheck();
    if (active) {
      cy.get('[data-testing-id="active"]').check();
    }
  }

  submit() {
    this.submitButton().click();
    waitLoadingEnd(1000);
  }
}

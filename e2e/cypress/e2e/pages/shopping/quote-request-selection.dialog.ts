import { waitLoadingEnd } from '../../framework';

export class QuoteRequestSelectionDialog {
  readonly tag = 'ish-select-quote-request-modal';

  private submitButton = () => cy.get('[data-testing-id="submit-quote-request-selection"]');
  private nameInput = () => cy.get('input[data-testing-id="newQuoteRequest"]');
  private quoteRequestRadios = () => cy.get('input[type="radio"][data-testing-id^="radio-"]');

  // create a new quote request with the given display name
  confirmNew(name: string) {
    this.nameInput().clear().type(name);
    this.submitButton().click();
    waitLoadingEnd(1000);
  }

  // pick the first available existing quote request (only shown when quote requests already exist)
  selectFirstExisting() {
    this.quoteRequestRadios().first().click();
    this.submitButton().click();
    waitLoadingEnd(1000);
  }

  hide() {
    cy.get('.btn-close').click();
  }
}

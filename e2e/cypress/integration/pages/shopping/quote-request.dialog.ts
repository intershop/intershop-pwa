import { waitLoadingEnd } from '../../framework';
import { MyAccountPage } from '../account/my-account.page';
import { QuoteListPage } from '../account/quote-list.page';
import { HeaderModule } from '../header.module';

export class QuoteRequestDialog {
  readonly tag = 'ish-product-add-to-quote-dialog';

  readonly header = new HeaderModule();
  readonly myAccountPage = new MyAccountPage();
  readonly quoteListPage = new QuoteListPage();

  private saveQuoteRequestButton = () => cy.get('[data-testing-id="saveQuoteRequest"]');
  private submitQuoteRequestButton = () => cy.get('[data-testing-id="submitQuoteRequest"]');
  private hideButton = () => cy.get('.close');
  private quantityInput = () => cy.get('[data-testing-id="quantity"]');
  private quoteId = () => cy.get('[data-testing-id="quoteId"]');

  saveQuoteRequest() {
    this.saveQuoteRequestButton().click();
  }

  submitQuoteRequest() {
    this.submitQuoteRequestButton().click();
  }

  setQuantity(quantity: number) {
    this.quantityInput().type(quantity.toString());
  }

  hide() {
    this.hideButton().click();
  }

  gotoQuoteDetail() {
    this.quoteId().then(x => {
      const id = x.attr('data-quote-id');
      this.hide();
      this.header.goToMyAccount();
      this.myAccountPage.navigateToQuoting();
      waitLoadingEnd();
      this.quoteListPage.goToQuoteDetailLink(id);
    });
  }

  get productId() {
    return cy.get('[itemprop="sku"]');
  }

  get quoteState() {
    return cy.get('ish-quote-state');
  }
}

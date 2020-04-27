import { fillFormField } from '../../framework';
import { HeaderModule } from '../header.module';

export class QuickorderPage {
  readonly tag = 'ish-quickorder-page';

  readonly header = new HeaderModule();

  private addToCartButton = () => cy.get('[data-testing-id="add-form-to-cart"]');

  fillFormLine(idx: number, sku: string, quantity?: number) {
    fillFormField(`[data-testing-id="quickorder-line-${idx}"]`, 'sku', sku);
    if (quantity !== undefined) {
      fillFormField(`[data-testing-id="quickorder-line-${idx}"]`, 'quantity', quantity);
    }
  }

  addLine() {
    cy.get('a[data-testing-id="add-quickorder-line"]').click();
  }

  addToCart(): Cypress.Chainable<Cypress.WaitXHR> {
    cy.wait(3000);
    cy.server()
      .route('POST', '**/baskets/*/items')
      .as('basket');
    cy.server()
      .route('GET', '**/baskets/current*')
      .as('basketCurrent');
    cy.wait(3000);
    this.addToCartButton().click();

    return (
      cy
        .wait('@basket')
        // tslint:disable-next-line: no-any
        .then(result => (result.status >= 400 ? result : cy.wait('@basketCurrent').then(() => result))) as any
    );
  }
}

import { fillFormField, performAddToCart } from '../../framework';
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

  addToCart() {
    return performAddToCart(this.addToCartButton);
  }
}

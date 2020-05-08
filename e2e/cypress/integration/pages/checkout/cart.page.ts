import { AddToWishlistModule } from '../account/add-to-wishlist.module';
import { HeaderModule } from '../header.module';

export class CartPage {
  readonly tag = 'ish-shopping-basket';

  readonly header = new HeaderModule();
  readonly addToWishlist = new AddToWishlistModule();

  private saveQuoteRequestButton = () => cy.get('[id="createQuote"]');

  beginCheckout() {
    cy.wait(1000);
    cy.get(this.tag).find('button').contains('Checkout').click();
  }

  createQuoteRequest() {
    this.saveQuoteRequestButton().click();
  }

  private addToWishlistButton = () => cy.get('ish-shopping-basket').find('[data-testing-id="addToWishlistButton"]');

  get lineItems() {
    return cy.get(this.tag).find('div.pli-description');
  }

  addProductToWishlist() {
    this.addToWishlistButton().click();
  }

  lineItem(idx: number) {
    return {
      quantity: {
        set: (num: number) =>
          cy.get(this.tag).find('input[data-testing-id="quantity"]').eq(idx).clear().type(num.toString()).blur(),
      },
      remove: () => cy.get(this.tag).find('svg[data-icon="trash-alt"]').eq(idx).click(),
      sku: cy.get(this.tag).find('.product-id').eq(idx),
      openVariationEditDialog: () =>
        cy.get(this.tag).find('ish-line-item-edit').eq(idx).find('a.line-item-edit-link').click(),
    };
  }

  get subtotal() {
    return cy.get('[data-testing-id="basket-subtotal"]');
  }

  get tax() {
    return cy.get('[data-testing-id="basket-tax"]');
  }

  get lineItemInfoMessage() {
    return {
      message: cy.get('ish-line-item-list').find('.alert-info'),
    };
  }

  get errorMessage() {
    return {
      message: cy.get('ish-error-message').find('.alert-error'),
    };
  }
}

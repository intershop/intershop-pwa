import { waitLoadingEnd } from '../../framework';
import { AddToOrderTemplateModule } from '../account/add-to-order-template.module';
import { AddToWishlistModule } from '../account/add-to-wishlist.module';
import { HeaderModule } from '../header.module';

export class CartPage {
  readonly tag = 'ish-shopping-basket';

  readonly header = new HeaderModule();
  readonly addToWishlist = new AddToWishlistModule();
  readonly addToOrderTemplate = new AddToOrderTemplateModule();

  private saveQuoteRequestButton = () => cy.get('[id="createQuote"]');

  beginCheckout() {
    cy.wait(1000);
    cy.get(this.tag).find('button').contains('Checkout').click();
  }

  createQuoteRequest() {
    waitLoadingEnd(1000);
    this.saveQuoteRequestButton().click();
    waitLoadingEnd(1000);
  }

  private addToWishlistButton = () => cy.get('ish-shopping-basket').find('[data-testing-id="addToWishlistButton"]');

  private addToOrderTemplateButton() {
    return cy.get('ish-shopping-basket').find('[data-testing-id="addToOrderTemplateButton"]').first();
  }

  private addBasketToOrderTemplateButton() {
    return cy.get('ish-shopping-basket').find('[data-testing-id="addBasketToOrderTemplateButton"]');
  }

  get lineItems() {
    return cy.get(this.tag).find('div.pli-description');
  }

  addProductToWishlist() {
    this.addToWishlistButton().click();
  }

  addProductToOrderTemplate() {
    this.addToOrderTemplateButton().click();
  }

  addBasketToOrderTemplate() {
    this.addBasketToOrderTemplateButton().click();
  }

  collapsePromotionForm() {
    return cy.get('[data-testing-id="promo-collapse-link"]').click();
  }

  submitPromotionCode(code: string) {
    cy.get('[data-testing-id="promo-code-form"] input').clear().type(code);
    return cy.get('[data-testing-id="promo-code-form"] button').click();
  }

  removePromotionCode() {
    return cy.get('[data-testing-id="promo-remove-link"]').click();
  }

  lineItem(idx: number) {
    return {
      quantity: {
        set: (num: number) =>
          cy
            .get(this.tag)
            .find('input[data-testing-id="quantity"]:visible')
            .eq(idx)
            .click()
            .wait(1000)
            .clear()
            .wait(1000)
            .type(num.toString())
            .wait(1000)
            .blur(),
        get: () =>
          cy
            .get(this.tag)
            .find('input[data-testing-id="quantity"]:visible')
            .eq(idx)
            .invoke('val')
            .then(v => +v),
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

  get promotion() {
    return cy.get('.cost-summary ish-basket-promotion');
  }

  get lineItemInfoMessage() {
    return {
      message: cy.get('ish-line-item-list').find('.alert-info'),
    };
  }

  get errorMessage() {
    return {
      message: cy.get('#toast-container').find('.toast-error'),
    };
  }

  get successMessage() {
    return {
      message: cy.get('#toast-container').find('.toast-message'),
    };
  }
}

import { waitLoadingEnd } from '../../framework';
import { AddToOrderTemplateModule } from '../account/add-to-order-template.module';
import { AddToWishlistModule } from '../account/add-to-wishlist.module';
import { HeaderModule } from '../header.module';

export class CartPage {
  readonly tag = 'ish-shopping-basket';

  readonly header = new HeaderModule();
  readonly addToWishlist = new AddToWishlistModule();
  readonly addToOrderTemplate = new AddToOrderTemplateModule();

  private saveQuoteRequestButton = () => cy.get('[data-testing-id="create-quote-from-basket"]');

  beginCheckout() {
    cy.wait(1000);
    cy.get(this.tag).find('button').contains('Checkout').click();
  }

  createQuoteRequest(waitEnabled = true) {
    if (waitEnabled) {
      this.saveQuoteRequestButton().should('not.have.class', 'disabled');
      cy.wait(3000);
      waitLoadingEnd();
    }
    this.saveQuoteRequestButton().click();
    waitLoadingEnd();
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

  get costCenterSelection() {
    return cy.get('[data-testing-id="costCenter"]');
  }

  selectCostCenter(id: string) {
    this.costCenterSelection.then(selects => {
      const select = selects[0];
      cy.wrap(select)
        .click()
        .get('ng-dropdown-panel')
        .get('.ng-option')
        .contains(id)
        .then(item => {
          cy.wrap(item).click();
        });
    });
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

  validateDirectOrderSku(sku: string) {
    cy.get('[data-testing-id="direct-order-form"] input').first().clear().type(sku).wait(1000);
    cy.get('[data-testing-id="direct-order-form"] small').first().contains(`The product ID ${sku} is not valid.`);
  }

  addProductToBasketWithDirectOrder(sku: string) {
    cy.get('[data-testing-id="direct-order-form"] input').first().clear().type(sku).wait(1000);
    cy.get('[data-testing-id="direct-order-form"] button').last().click();
    waitLoadingEnd();
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
      warranty: {
        set: (warrantyId: string) => cy.get('[data-testing-id="product-warranties"]').eq(idx).select(warrantyId),
        // Precondition for "get": all products except the last one has to have a warranty
        // TODO: find a better way to detect if a line item has the warranty component
        get: () => cy.get(this.tag).find('[data-testing-id="product-warranties"]').eq(idx),
      },
      remove: () => cy.get(this.tag).find('[data-testing-id="remove-line-item"]').eq(idx).click(),
      sku: cy.get(this.tag).find('.product-id').eq(idx),
      openVariationEditDialog: () =>
        cy.get(this.tag).find('ish-line-item-edit').eq(idx).find('.line-item-edit-link').click(),
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

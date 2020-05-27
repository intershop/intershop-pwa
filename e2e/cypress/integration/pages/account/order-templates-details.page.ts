import { HeaderModule } from '../header.module';

export class OrderTemplatesDetailsPage {
  readonly tag = 'ish-account-order-template-detail-page';

  readonly header = new HeaderModule();

  static navigateToOverviewPage() {
    cy.get('[href="/account/order-templates"]')
      .first()
      .click();
  }

  get listItem() {
    return cy.get('ish-account-order-template-detail-line-item');
  }

  get listItemLink() {
    return cy
      .get('ish-account-order-template-detail-line-item')
      .find('a[data-testing-id="order-template-product-link"]');
  }

  get OrderTemplateTitle() {
    return cy
      .get('ish-account-order-template-detail-page')
      .find('h1')
      .invoke('text');
  }

  getOrderTemplateItemById(id: string) {
    return cy
      .get('span')
      .contains(id)
      .closest('ish-account-order-template-detail-line-item')
      .parent();
  }

  toggleCheckbox(id: string) {
    this.getOrderTemplateItemById(id)
      .find('[data-testing-id="productCheckbox"]')
      .click();
  }

  getOrderTemplateCartButton() {
    return cy.get('ish-product-add-to-basket');
  }

  deleteOrderTemplate(id: string) {
    this.getOrderTemplateItemById(id)
      .find('[data-testing-id="delete-order-template"]')
      .click();
  }

  moveProductToOrderTemplate(productId: string, listName: string) {
    this.getOrderTemplateItemById(productId)
      .find('[data-testing-id="move-order-template"]')
      .click();
    cy.get(`[data-testing-id="${listName}"]`).check();
    cy.get('ngb-modal-window')
      .find('button[class="btn btn-primary"]')
      .click();
    cy.get('[data-testing-id="order-template-success-link"] a').click();
  }

  addProductToBasket(productId?: string, quantity?: number) {
    if (productId && quantity) {
      this.getOrderTemplateItemById(productId)
        .find('[data-testing-id="quantity"]')
        .clear()
        .type(quantity.toString());
    }
    cy.wait(3000);
    cy.server()
      .route('POST', '**/baskets/*/items')
      .as('basket');
    cy.server()
      .route('GET', '**/baskets/current*')
      .as('basketCurrent');
    cy.wait(3000);

    this.getOrderTemplateCartButton()
      .find('[data-testing-id="addToCartButton"]')
      .click();

    return (
      cy
        .wait('@basket')
        // tslint:disable-next-line: no-any
        .then(result => (result.status >= 400 ? result : cy.wait('@basketCurrent').then(() => result))) as any
    );
  }
}

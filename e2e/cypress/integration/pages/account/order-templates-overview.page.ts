import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class OrderTemplatesOverviewPage {
  readonly tag = 'ish-account-order-template-page';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  addOrderTemplate(name: string) {
    cy.get('a[data-testing-id="add-order-template"').click();
    cy.get('[data-testing-id="title"]').clear().type(name);
    cy.get('[data-testing-id="order-template-dialog-submit"]').click();
  }

  addOrderTemplateToCart(id: string) {
    this.orderTemplatesArray
      .find('a')
      .contains(id)
      .closest('[data-testing-id="order-template-list-item-container"]')
      .find('[data-testing-id="addToCartButton"]')
      .click();
  }

  deleteOrderTemplateById(id: string) {
    this.orderTemplatesArray
      .find('a')
      .contains(id)
      .closest('[data-testing-id="order-template-list-item-container"]')
      .find('[data-testing-id="delete-order-template"]')
      .click();
    cy.get('[data-testing-id="confirm"]').click();
  }

  goToOrderTemplateDetailLink(name: string) {
    cy.get('a').contains(name).click();
  }

  get orderTemplatesArray() {
    return cy.get('[data-testing-id="order-template-list-item"]');
  }

  get orderTemplatesTitlesArray() {
    return this.orderTemplatesArray.find('[data-testing-id="order-template-list-title"]').invoke('text');
  }
}

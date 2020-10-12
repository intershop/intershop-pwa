export class AddToOrderTemplateModule {
  constructor(private contextSelector: string = 'ish-product-listing') {}

  addNewOrderTemplate(name: string) {
    cy.wait(500);
    cy.get('.modal-body input').type(name);
    cy.get('.modal-footer button.btn-primary').click();
  }

  addProductToOrderTemplateFromPage(title: string = '', modal: boolean = false) {
    if (modal) {
      cy.get(`[data-testing-id="${title}"]`).click();
      cy.get('.modal-footer button.btn-primary').click();
    }
    this.closeAddProductToOrderTemplateModal('link');
  }

  addProductToOrderTemplateFromList(product: string, title: string, modal: boolean = true) {
    if (modal) {
      cy.get(this.contextSelector)
        .find(`ish-product-item div[data-testing-sku="${product}"] ish-product-add-to-order-template button`)
        .click();
      if (title) {
        cy.get(`[data-testing-id="${title}"]`).click();
      }
      cy.get('.modal-footer button.btn-primary').click();
      this.closeAddProductToOrderTemplateModal('link');
    } else {
      cy.get(this.contextSelector)
        .find(`ish-product-item div[data-testing-sku="${product}"] ish-product-add-to-order-template button`)
        .click();
      this.closeAddProductToOrderTemplateModal('link');
    }
  }

  private closeAddProductToOrderTemplateModal(mode: 'link' | 'x') {
    cy.wait(500);
    mode === 'link'
      ? cy.get('[data-testing-id="order-template-success-link"] a').click()
      : cy.get('.modal-header button').click();
  }
}

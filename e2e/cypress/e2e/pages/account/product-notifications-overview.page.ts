import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class ProductNotificationsOverviewPage {
  readonly tag = 'ish-account-product-notifications-page ';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  get productNotificationsArray() {
    return cy.get('[data-testing-id="product-notification-list-item"]');
  }

  get productNotificationNameArray() {
    return this.productNotificationsArray.find('a[data-testing-id="product-name-link"]').invoke('text');
  }

  get productNotificationMessage() {
    return this.productNotificationsArray.find('div[data-testing-id="product-notification-message"]').invoke('text');
  }

  updateProductNotificationByProductName(productName: string, price: number, email: string) {
    this.productNotificationsArray
      .find('a')
      .contains(productName)
      .closest('[data-testing-id="product-notification-list-item"]')
      .find('[data-testing-id="product-notification-edit"]')
      .click();
    cy.get('[data-testing-id="pricevalue"]').clear().type(price.toString());
    cy.get('[data-testing-id="email"]').clear().type(email);
    cy.get('[data-testing-id="product-notification-edit-dialog-edit"]').click();
  }

  deleteProductNotificationByProductName(productName: string) {
    this.productNotificationsArray
      .find('a')
      .contains(productName)
      .closest('[data-testing-id="product-notification-list-item"]')
      .find('[data-testing-id="product-notification-remove"]')
      .click();
    cy.get('[data-testing-id="product-notification-delete"]').click();
  }
}

import { BreadcrumbModule } from '../breadcrumb.module';
import { HeaderModule } from '../header.module';

export class OrderDetailsPage {
  readonly tag = 'ish-account-order-page';

  readonly header = new HeaderModule();
  readonly breadcrumb = new BreadcrumbModule();

  get orderCustomFields() {
    return cy.get('[data-testing-id="additional-information-basket-custom-fields"]');
  }

  getLineItemCustomFields(sku: string) {
    return cy.get(`[data-testing-id="line-item-information-edit_${sku}"]`);
  }
}

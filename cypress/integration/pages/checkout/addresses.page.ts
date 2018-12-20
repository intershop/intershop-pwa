import { waitLoadingEnd } from '../../framework';

export class AddressesPage {
  readonly tag = 'ish-checkout-address-page-container';

  private selectFirst(type: string) {
    cy.get(`[data-testing-id="${type}"]`)
      .find('select')
      .first()
      .then(select => {
        const option = select.find('option').eq(1);
        const val = option.attr('value');
        // tslint:disable-next-line:ban
        cy.get(`[data-testing-id="${type}"]`)
          .find('select')
          .first()
          .select(val);
      });
  }

  selectFirstInvoiceAddress() {
    this.selectFirst('invoiceToAddress');
    waitLoadingEnd();
  }

  selectFirstShippingAddress() {
    this.selectFirst('shipToAddress');
    waitLoadingEnd();
  }

  continueCheckout() {
    cy.get('button')
      .contains('Continue Checkout')
      .click();
  }
}

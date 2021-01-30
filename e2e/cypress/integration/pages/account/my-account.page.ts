import { HeaderModule } from '../header.module';

export class MyAccountPage {
  readonly tag = 'ish-account-page';

  readonly header = new HeaderModule();

  static navigateTo() {
    cy.visit('/account');
  }

  navigateToQuoting() {
    cy.get('a[data-testing-id="quote-list-link"]').click();
  }

  get respondedQuotesCount() {
    return cy.get('[data-testing-id="responded-counter"]');
  }

  get submittedQuotesCount() {
    return cy.get('[data-testing-id="submitted-counter"]');
  }

  navigateToAddresses() {
    cy.get('a[data-testing-id="addresses-link"]').click();
  }

  navigateToWishlists() {
    cy.get('a[data-testing-id="wishlists-link"]').click();
  }

  navigateToOrderTemplates() {
    cy.get('a[href="/account/order-templates"]').first().click();
  }

  navigateToPayments() {
    cy.get('a[data-testing-id="payments-link"]').click();
  }
}

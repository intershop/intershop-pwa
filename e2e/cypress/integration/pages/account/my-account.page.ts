import { HeaderModule } from '../header.module';

export class MyAccountPage {
  readonly tag = 'ish-account-page';

  readonly header = new HeaderModule();

  static navigateTo() {
    cy.visit('/account');
  }

  navigateToQuoting() {
    cy.get('a[data-testing-id="quoute-list-link"]').click();
  }

  get newQuoteLabel() {
    return cy.get('[data-testing-id="new-counter"]');
  }

  get submittedQuoteLabel() {
    return cy.get('[data-testing-id="submitted-counter"]');
  }

  get acceptedQuoteLabel() {
    return cy.get('[data-testing-id="accepted-counter"]');
  }

  get rejectedQuoteLabel() {
    return cy.get('[data-testing-id="rejected-counter"]');
  }

  navigateToAddresses() {
    cy.get('a[data-testing-id="addresses-link"]').click({ force: true });
  }

  navigateToWishlists() {
    cy.get('a[data-testing-id="wishlists-link"]').click();
  }

  navigateToOrderTemplates() {
    cy.get('a[href="/account/order-templates"]').click();
  }

  navigateToPayments() {
    cy.get('a[data-testing-id="payments-link"]').click();
  }
}

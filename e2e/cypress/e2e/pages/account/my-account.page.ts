import { HeaderModule } from '../header.module';

export class MyAccountPage {
  readonly tag = 'ish-account-page';

  readonly header = new HeaderModule();

  static navigateTo() {
    cy.visit('/account');
  }

  navigateToQuoting() {
    cy.get('a[data-testing-id="quotes-nav-link"]').click();
  }

  get respondedQuotesCount() {
    return cy.get('[data-testing-id="responded-counter"]');
  }

  get submittedQuotesCount() {
    return cy.get('[data-testing-id="submitted-counter"]');
  }

  navigateToAddresses() {
    cy.get('a[data-testing-id="addresses-nav-link"]').click();
  }

  navigateToWishlists() {
    cy.get('a[data-testing-id="wishlists-nav-link"]').click();
  }

  navigateToProductNotifications() {
    cy.get('a[data-testing-id="notifications-nav-link"]').click();
  }

  navigateToOrderTemplates() {
    cy.get('a[data-testing-id="order-templates-nav-link"]').click();
  }

  navigateToPayments() {
    cy.get('a[data-testing-id="payment-nav-link"]').click();
  }
}

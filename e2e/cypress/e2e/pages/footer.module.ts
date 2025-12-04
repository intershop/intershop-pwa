export class FooterModule {
  gotoErrorPage() {
    cy.get('ish-footer').contains('Error').click();
  }

  manageCookies() {
    cy.get('ish-footer').find('a[href="/cookies"]').click();
  }
}

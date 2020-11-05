export class FooterModule {
  gotoErrorPage() {
    cy.get('ish-footer a[title="Error Page"]').click();
  }

  manageCookies() {
    cy.get('ish-footer a[title="Manage Cookies"]').click();
  }
}

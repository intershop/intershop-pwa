export class FooterModule {
  gotoErrorPage() {
    cy.get('ish-footer a[title="Error Page"]').click();
  }
}

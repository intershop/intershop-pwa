export class BreadcrumbModule {
  get items() {
    return cy.get('li.breadcrumbs-list');
  }
}

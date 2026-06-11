export class BreadcrumbModule {
  get items() {
    return cy.get('li.breadcrumb-item');
  }
}

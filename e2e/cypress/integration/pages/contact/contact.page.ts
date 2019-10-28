import { BreadcrumbModule } from '../breadcrumb.module';

export class ContactPage {
  readonly tag = 'ish-contact-page-container';
  readonly breadcrumb = new BreadcrumbModule();

  static navigateTo() {
    cy.visit('/contact');
  }

  private submitButton = () => cy.get('[data-testing-id="submitContact"]');

  fillForm(name: string, email: string, phone: string, subject: string, comments: string) {
    cy.get('input[data-testing-id="name"]')
      .clear()
      .type(name)
      .blur();
    cy.get('input[data-testing-id="email"]')
      .clear()
      .type(email)
      .blur();
    cy.get('input[data-testing-id="phone"]')
      .clear()
      .type(phone)
      .blur();
    // tslint:disable-next-line:ban
    cy.get('select[data-testing-id="subject"]').select(subject);
    cy.get('textarea[data-testing-id="comments"]')
      .clear()
      .type(comments)
      .blur();
    return this;
  }

  submit() {
    this.submitButton().click();
  }
}

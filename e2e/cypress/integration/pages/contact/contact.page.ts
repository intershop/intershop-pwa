import { BreadcrumbModule } from '../breadcrumb.module';

export class ContactPage {
  readonly tag = 'ish-contact-page';
  readonly breadcrumb = new BreadcrumbModule();

  static navigateTo() {
    cy.visit('/contact');
  }

  private submitButton = () => cy.get('[data-testing-id="submitContact"]');

  get nameInput() {
    return cy.get('input[data-testing-id="name"]');
  }

  get emailInput() {
    return cy.get('input[data-testing-id="email"]');
  }

  get phoneInput() {
    return cy.get('input[data-testing-id="phone"]');
  }

  fillForm(name: string, email: string, phone: string, subject: string, comments: string) {
    this.nameInput
      .clear()
      .type(name)
      .blur();
    this.emailInput
      .clear()
      .type(email)
      .blur();
    this.phoneInput
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

import { fillFormField } from '../../framework';
import { BreadcrumbModule } from '../breadcrumb.module';

declare interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  comment: string;
}

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

  fillForm(content: ContactForm) {
    Object.keys(content)
      .filter(key => content[key] !== undefined)
      .forEach((key: keyof ContactForm) => {
        fillFormField(this.tag, key, content[key]);
      });

    return this;
  }

  submit() {
    this.submitButton().click();
  }
}

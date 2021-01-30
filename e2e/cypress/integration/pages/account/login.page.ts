import { HeaderModule } from '../header.module';

export class LoginPage {
  readonly tag = 'ish-login-form';

  readonly header = new HeaderModule();

  static navigateTo(returnUrl = '/account') {
    cy.clearCookie('apiToken');
    cy.visit('/login?returnUrl=' + returnUrl.replace(/\//g, '%2F'));
  }

  get content() {
    return cy.get(this.tag);
  }

  fillForm(user: string, password: string) {
    cy.get('input[data-testing-id="login"]').clear().type(user).blur();
    cy.get('input[data-testing-id="password"]').clear().type(password).blur();
    return this;
  }

  submit() {
    cy.intercept('GET', /.*\/customers\/-.*/).as('currentCustomer');
    cy.wait(500);

    cy.get('button[name="login"]').click();

    return cy.wait('@currentCustomer');
  }

  get errorText() {
    return cy.get('div.alert');
  }

  get infoText() {
    return cy.get('.alert-info');
  }
}

export class LoginPage {
  readonly tag = 'ish-login-form';

  static navigateTo() {
    cy.visit('/login');
  }

  fillForm(user: string, password: string) {
    cy.get('input[data-testing-id="login"]')
      .clear()
      .type(user)
      .blur();
    cy.get('input[data-testing-id="password"]')
      .clear()
      .type(password)
      .blur();
    return this;
  }

  submit() {
    cy.server();
    cy.route('GET', '**/customers/**').as('customers');
    cy.wait(500);

    cy.get('button[name="login"]').click();

    return cy.wait('@customers');
  }

  get errorText() {
    return cy.get('div.alert', { timeout: 5000 });
  }
}

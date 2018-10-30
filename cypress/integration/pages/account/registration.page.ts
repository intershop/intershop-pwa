export interface Registration {
  login: string;
  loginConfirmation: string;
  password: string;
  passwordConfirmation: string;
  securityQuestion: number;
  securityQuestionAnswer: string;
  countryCodeSwitch: 'BG' | 'DE' | 'FR' | 'IN' | 'GB' | 'US';
  title: number;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postalCode: string;
  city: string;
  mainDivision: string;
  phoneHome: string;
}

export const sensibleDefaults: Partial<Registration> = {
  password: '!InterShop00!',
  securityQuestion: 1,
  securityQuestionAnswer: 'something',
  countryCodeSwitch: 'DE',
  title: 1,
  firstName: 'Test',
  lastName: 'User',
  addressLine1: 'Testroad 1',
  postalCode: '12345',
  city: 'Testcity',
};

export class RegistrationPage {
  readonly tag = 'ish-registration-form';

  static navigateTo() {
    cy.visit('/register');
  }

  private fillInput(key: string, value: string) {
    cy.get(`[data-testing-id="${key}"]`)
      .clear()
      .type(value)
      .blur();
  }

  fillForm(register: Partial<Registration>) {
    Object.keys(register).forEach(key => {
      cy.get(this.tag).then(form => {
        if (form.find(`input[data-testing-id="${key}"]`).length) {
          this.fillInput(key, register[key]);
          if (key === 'login' && !register.loginConfirmation) {
            this.fillInput('loginConfirmation', register.login);
          } else if (key === 'password' && !register.passwordConfirmation) {
            this.fillInput('passwordConfirmation', register.password);
          }
        } else if (form.find(`select[data-testing-id="${key}"]`).length) {
          if (typeof register[key] === 'number') {
            cy.get(`[data-testing-id="${key}"]`)
              .find('option')
              .eq(register[key])
              .then(option => {
                const val = option.attr('value');
                // tslint:disable-next-line:ban
                cy.get(`[data-testing-id="${key}"]`).select(val);
              });
          } else {
            // tslint:disable-next-line:ban
            cy.get(`[data-testing-id="${key}"]`).select(register[key]);
          }
        }
      });
    });
    return this;
  }

  submit() {
    cy.server();
    cy.route('POST', '**/customers').as('customers');
    cy.wait(500);

    cy.get(`${this.tag} form`)
      .first()
      .submit();
    return cy.wait('@customers');
  }

  cancel() {
    cy.get(this.tag)
      .find('input[value="Cancel"]')
      .click();
  }

  get errorText() {
    return cy.get('div.alert', { timeout: 5000 });
  }
}

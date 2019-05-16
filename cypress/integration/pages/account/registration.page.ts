import { fillInput } from '../../framework';

export interface Registration {
  login: string;
  loginConfirmation: string;
  password: string;
  passwordConfirmation: string;
  securityQuestion: number;
  securityQuestionAnswer: string;
  countryCodeSwitch: string;
  title: number;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postalCode: string;
  city: string;
  mainDivisionCode: string;
  phoneHome: string;
  companyName1: string;
}

export const sensibleDefaults: Partial<Registration> = {
  password: '!InterShop00!',
  securityQuestion: 1,
  securityQuestionAnswer: 'something',
  countryCodeSwitch: 'AT',
  title: 1,
  firstName: 'Test',
  lastName: 'User',
  addressLine1: 'Testroad 1',
  postalCode: '12345',
  city: 'Testcity',
  mainDivisionCode: 'Wien',
};

export class RegistrationPage {
  readonly tag = 'ish-registration-form';

  static navigateTo() {
    cy.visit('/register');
  }

  input(key: keyof Registration) {
    const input = cy.get(`[data-testing-id="${key}"]`);
    return {
      ...input,
      should: (t: 'be.valid' | 'be.invalid' | string, arg?) => {
        switch (t) {
          case 'be.valid':
            return input.should('have.class', 'ng-dirty').should('have.class', 'ng-valid');
          case 'be.invalid':
            return input.should('have.class', 'ng-dirty').should('have.class', 'ng-invalid');
          default:
            return input.should(t, arg);
        }
      },
    };
  }

  fillForm(register: Partial<Registration>) {
    Object.keys(register).forEach((key: keyof Registration) => {
      cy.get(this.tag).then(form => {
        if (form.find(`input[data-testing-id="${key}"]`).length) {
          fillInput(key, register[key].toString());
          if (key === 'login' && !register.loginConfirmation) {
            fillInput('loginConfirmation', register.login);
          } else if (key === 'password' && !register.passwordConfirmation) {
            fillInput('passwordConfirmation', register.password);
          }
        } else if (form.find(`select[data-testing-id="${key}"]`).length) {
          if (typeof register[key] === 'number') {
            cy.get(`[data-testing-id="${key}"]`)
              .find('option')
              .eq(register[key] as number)
              .then(option => {
                const val = option.attr('value');
                // tslint:disable-next-line:ban
                cy.get(`[data-testing-id="${key}"]`).select(val);
              });
          } else {
            // tslint:disable-next-line:ban
            cy.get(`[data-testing-id="${key}"]`).select(register[key].toString());
          }
        }
      });
    });
    return this;
  }

  submit() {
    return cy
      .get(`${this.tag} form`)
      .first()
      .submit();
  }

  submitAndObserve() {
    cy.server();
    cy.route('POST', '**/customers').as('customers');
    cy.wait(500);

    this.submit();
    return cy.wait('@customers');
  }

  cancel() {
    cy.get(this.tag)
      .find('input[value="Cancel"]')
      .click();
  }

  get errorText() {
    return cy.get('div.alert');
  }
}

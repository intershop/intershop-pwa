import { fillFormField } from '../../framework';

export type SupportedLanguage = 'en_US' | 'de_DE' | 'fr_FR';

export interface Registration {
  login: string;
  loginConfirmation: string;
  password: string;
  passwordConfirmation: string;
  countryCodeSwitch: string;
  title: string;
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
  preferredLanguage: SupportedLanguage;
}

export const sensibleDefaults: Partial<Registration> = {
  password: '!InterShop00!',
  countryCodeSwitch: 'AT',
  firstName: 'Test',
  lastName: 'User',
  addressLine1: 'Testroad 1',
  postalCode: '12345',
  city: 'Testcity',
  phoneHome: '123456789',
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

  acceptTAC() {
    cy.get('input[data-testing-id="termsAndConditions"]').check();
  }

  fillForm(register: Partial<Registration>) {
    if (register.loginConfirmation === undefined) {
      register.loginConfirmation = register.login;
    }
    if (register.passwordConfirmation === undefined) {
      register.passwordConfirmation = register.password;
    }
    Object.keys(register)
      .filter(key => register[key] !== undefined)
      .forEach((key: keyof Registration) => {
        fillFormField(this.tag, key, register[key]);
      });

    // special handling as captcha component steals focus
    if (register.login) {
      fillFormField(this.tag, 'login', register.login);
    }
    if (register.password) {
      fillFormField(this.tag, 'password', register.password);
    }

    return this;
  }

  submit() {
    return cy.get(`${this.tag} form`).first().submit();
  }

  submitAndObserve() {
    cy.intercept('POST', /.*\/(private)?customers$/).as('customers');
    cy.wait(500);

    this.submit();
    return cy.wait('@customers');
  }

  cancel() {
    cy.get(this.tag).find('input[value="Cancel"]').click();
  }

  get errorText() {
    return cy.get('.toast-container .toast-error');
  }
}

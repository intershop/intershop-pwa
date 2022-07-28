import { at } from '../../framework';
import { Registration, RegistrationPage } from '../../pages/account/registration.page';

describe('Potential Registering User', () => {
  beforeEach(() => RegistrationPage.navigateTo());

  const requiredFields: (keyof Registration)[] = [
    'login',
    'password',
    'countryCode',
    'firstName',
    'lastName',
    'addressLine1',
    'postalCode',
    'city',
  ];

  it('should submit empty form and get validation errors for required fields', () => {
    at(RegistrationPage, page => {
      page.submit();

      requiredFields.forEach(key => page.input(key).should('be.invalid'));
      // test formly class for formly fields
      requiredFields
        .filter(key => key !== 'login' && key !== 'password')
        .forEach(key => page.wrapper(key).should('be.invalid'));
    });
  });

  it('should enter invalid email and see instant error response', () => {
    at(RegistrationPage, page => {
      page.fillForm({ login: 'test' });

      page.input('login').should('be.invalid');
    });
  });

  it('should enter not matching email and see instant error response', () => {
    at(RegistrationPage, page => {
      page.fillForm({ login: 'test@example.org', loginConfirmation: 'hello@example.org' });

      page.input('login').should('be.valid');
      page.input('loginConfirmation').should('be.invalid');
    });
  });

  it('should enter too simple password and see instant error response', () => {
    at(RegistrationPage, page => {
      page.fillForm({ password: 'test' });

      page.input('password').should('be.invalid');
    });
  });

  it('should enter not matching passwords and see instant error response', () => {
    at(RegistrationPage, page => {
      page.fillForm({ password: 'test11!', passwordConfirmation: 'hello11!' });

      page.input('password').should('be.valid');
      page.input('passwordConfirmation').should('be.invalid');
    });
  });
});

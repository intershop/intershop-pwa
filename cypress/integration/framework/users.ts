import { Registration } from '../pages/account/registration.page';

export function createUserViaREST(user: Partial<Registration>) {
  const customer = {
    firstName: user.firstName,
    lastName: user.lastName,
    customerNo: new Date().getTime().toString(),
    email: user.login,
    phoneHome: user.phoneHome,
    title: user.title,
    address: {
      title: user.title,
      firstName: user.firstName,
      lastName: user.lastName,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      addressLine3: user.addressLine3,
      postalCode: user.postalCode,
      city: user.city,
      phoneHome: user.phoneHome,
      countryCode: user.countryCodeSwitch,
    },
    credentials: {
      login: user.login,
      password: user.password,
      securityQuestion: "What is your mother''s maiden name?",
      securityQuestionAnswer: user.securityQuestionAnswer,
    },
    preferredLanguage: 'en_US',
  };

  cy.request('POST', Cypress.env('ICM_BASE_URL') + '/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-/customers', customer)
    .its('status')
    .should('equal', 201);
}

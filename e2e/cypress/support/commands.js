// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  cy.window().then(win => (win.angularStable = undefined));

  originalFn(url, { ...options, failOnStatusCode: false });

  cy.get('ish-root', { timeout: 60000 }).should('be.visible');

  return cy
    .window()
    .its('angularStable')
    .should('be.true')
    .then(() =>
      cy.url().should(newUrl => {
        const simplifiedUrl = url.replace(/[\/\?]/g, '.+').replace(' ', '.+');
        const oldUrlRegex = new RegExp(`(${simplifiedUrl}|\/error$)`);
        expect(newUrl).to.match(oldUrlRegex);
      })
    );
});

// reset cookies for each spec
before(() => {
  cy.clearCookie('apiToken');
});

beforeEach(() => {
  cy.window().then(win => {
    win.console.error = arg =>
      Cypress.log({
        name: 'Error',
        error: true,
        message: arg && (arg.message || JSON.stringify(arg)),
        consoleProps: () => arg,
      });
  });
});

// Cypress.Cookies.debug(true);

// keep certain cookies
Cypress.Cookies.defaults({
  preserve: ['apiToken'],
});

Cypress.on('uncaught:exception', (err, runnable) => {
  console.error(err);

  // returning false here prevents Cypress from
  // failing the test
  return false;
});

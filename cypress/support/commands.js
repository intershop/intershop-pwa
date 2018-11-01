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
  cy.server();
  cy.route('**/categories*').as('categories');
  originalFn(url, options);
  cy.url().should('match', new RegExp(`${url.replace(/[\/\?]/g, '.')}`));
  cy.get('body', { timeout: 60000 }).should('have.descendants', 'ish-root');

  return cy.get('body').then(body => {
    if (!body.find('#intershop-pwa-state').length) {
      return cy.wait('@categories').log('page ready -- top level categories loaded');
    } else {
      return cy.log('page ready -- found transferred state');
    }
  });
});

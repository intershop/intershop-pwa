import { Interception } from 'cypress/types/net-stubbing';

interface Page {
  tag: string;
}

let currentPage: Page;

export function waitLoadingEnd(initialWait: number = 500) {
  cy.wait(initialWait);
  cy.get('.loading').should('not.exist');
}

function onPage<T extends Page>(page: new () => T) {
  currentPage = new page();
  return cy.get(currentPage.tag);
}

export function at<T extends Page>(type: new () => T, callback?: (page: T) => void) {
  onPage(type).should('exist');
  waitLoadingEnd();
  if (callback) {
    callback(currentPage as T);
  }
}

export function back() {
  cy.go('back');
}

export function fillFormField(parent: string, key: string, value: number | string) {
  cy.get(parent).then(form => {
    const field = form.find(`[data-testing-id="${key}"]`);
    expect(field.length).to.equal(1, `expected to find one form field "${key}" in "${parent}"`);
    const tagName = field.prop('tagName');
    expect(tagName).to.match(/^(INPUT|SELECT|TEXTAREA|NG-SELECT)$/);

    cy.get(parent).within(() => {
      if (/^(INPUT|TEXTAREA)$/.test(tagName)) {
        const inputField = cy.get(`[data-testing-id="${key}"]`);
        inputField.focus().clear();
        if (value) {
          inputField.type(value.toString());
        }
      } else if (tagName === 'SELECT') {
        if (typeof value === 'number') {
          cy.get(`[data-testing-id="${key}"]`)
            .find('option')
            .eq(value as number)
            .then(option => option.attr('value'))
            .then(val => cy.get(`[data-testing-id="${key}"]`).select(val));
        } else {
          cy.get(`[data-testing-id="${key}"]`).select(value);
        }
      } else if (tagName === 'NG-SELECT') {
        const field = cy.get(`[data-testing-id="${key}"] input`);
        if (value) {
          field.type(value.toString());
        }
      }
    });
  });
}

export function performAddToCart(
  button: () => Cypress.Chainable<JQuery<HTMLElement>>
): Cypress.Chainable<Interception> {
  waitLoadingEnd(1000);
  cy.intercept('POST', '**/baskets/*/items').as('basket');
  cy.intercept('GET', '**/baskets/*').as('basketCurrent');
  waitLoadingEnd(1000);

  button().click();

  return cy.wait('@basket').then(
    result => (result.response.statusCode >= 400 ? result : cy.wait('@basketCurrent').then(() => result))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;
}

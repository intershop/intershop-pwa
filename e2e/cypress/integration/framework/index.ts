// tslint:disable no-barrel-files
interface Page {
  tag: string;
}

let currentPage: Page;

export function waitLoadingEnd(initialWait: number = 500) {
  cy.wait(initialWait);
  cy.get('div.loading').should('not.exist');
}

function onPage<T extends Page>(page: new () => T) {
  currentPage = new page();
  return cy.get(currentPage.tag);
}

export function at<T extends Page>(type: new () => T, callback?: (page: T) => void) {
  onPage(type).should('be.hidden');
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
    expect(tagName).to.match(/^(INPUT|SELECT)$/);

    cy.get(parent).within(() => {
      if (tagName === 'INPUT') {
        const inputField = cy.get(`[data-testing-id="${key}"]`);
        inputField.clear();
        if (value) {
          inputField.type(value.toString());
        }
        inputField.blur();
      } else if (tagName === 'SELECT') {
        if (typeof value === 'number') {
          cy.get(`[data-testing-id="${key}"]`)
            .find('option')
            .eq(value as number)
            .then(option => option.attr('value'))
            // tslint:disable-next-line:ban
            .then(val => cy.get(`[data-testing-id="${key}"]`).select(val));
        } else {
          // tslint:disable-next-line:ban
          cy.get(`[data-testing-id="${key}"]`).select(value);
        }
      }
    });
  });
}

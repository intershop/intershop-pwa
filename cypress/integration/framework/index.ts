// tslint:disable no-barrel-files
interface Page {
  tag: string;
}

let currentPage: Page;

function onPage<T extends Page>(page: { new (): T }) {
  currentPage = new page();
  return cy.get(currentPage.tag, { timeout: 120000 });
}
export function at<T extends Page>(type: { new (): T }, callback?: (page: T) => void) {
  onPage(type).should('be.hidden');
  cy.get('div.loading', { timeout: 60000 }).should('not.exist');
  if (callback) {
    callback(currentPage as T);
  }
}

export function back() {
  cy.go('back');
}

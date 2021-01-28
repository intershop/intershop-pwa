export class SearchBoxModule {
  get suggestions() {
    this.suggestionsOverlay().should('be.visible');
    return this.suggestionsOverlay()
      .get('li button')
      .then(array => {
        const suggestions = [];
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          suggestions.push(element.innerText);
        }
        return suggestions;
      });
  }

  get text() {
    return this.inputField().invoke('val');
  }

  get searchButton() {
    return cy.get(this.selector).find('button[name=search]');
  }

  get clearButton() {
    return cy.get(this.selector).find('button[name=reset]');
  }

  private static readonly INTERACTION_WAIT = 2000;
  private readonly selector = '[data-testing-id="search-box-desktop"]';

  private inputField() {
    return cy.get(this.selector + ' input.searchTerm');
  }

  private suggestionsOverlay() {
    return cy.get('ul.search-suggest-results');
  }

  search(searchTerm: string) {
    this.inputField().clear().type(searchTerm).type('{enter}');
  }

  assertNoSuggestions() {
    this.suggestionsOverlay().should('not.exist');
  }

  clickSuggestion(text: string) {
    return this.suggestionsOverlay().find('li button').contains(text).click({ force: true });
  }

  focus() {
    this.inputField().focus();
    cy.wait(SearchBoxModule.INTERACTION_WAIT);
    return this;
  }

  clear() {
    this.inputField().clear();
    cy.wait(SearchBoxModule.INTERACTION_WAIT);
    return this;
  }

  type(text: string) {
    this.inputField().type(text);
    cy.wait(SearchBoxModule.INTERACTION_WAIT);
    return this;
  }

  down() {
    this.inputField().type('{downarrow}');
    cy.wait(SearchBoxModule.INTERACTION_WAIT);
    return this;
  }

  up() {
    this.inputField().type('{uparrow}');
    cy.wait(SearchBoxModule.INTERACTION_WAIT);
    return this;
  }

  esc() {
    this.inputField().type('{esc}');
    cy.wait(SearchBoxModule.INTERACTION_WAIT);
  }

  backspace() {
    this.inputField().type('{backspace}');
    cy.wait(SearchBoxModule.INTERACTION_WAIT);
  }

  enter() {
    this.inputField().type('{enter}');
    cy.wait(SearchBoxModule.INTERACTION_WAIT);
  }
}

import { at, back, waitLoadingEnd } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { SearchResultPage } from '../../pages/shopping/search-result.page';

describe('Search Box', () => {
  before(() => {
    HomePage.navigateTo();
  });

  beforeEach(() => {
    at(HomePage, page => page.header.searchBox.assertNoSuggestions());
  });

  afterEach(() => {
    at(SearchResultPage, page => {
      page.title.should('contain', '22 items');
      page.title.should('contain', 'kensington');
      page.header.searchBox.text.should('contain', 'ken');
      page.header.searchBox.assertSuggestionsNoDisplayed();
    });

    back();

    at(HomePage, page => page.header.searchBox.clear());
  });

  it('should display suggest overlay when typing and follow when entering', () => {
    at(HomePage, page => {
      page.header.searchBox.type('k');
      page.header.searchBox.assertNoSuggestions();

      page.header.searchBox.type('en');
      page.header.searchBox.suggestions.should('contain', 'Kensington');

      page.header.searchBox.backspace();
      page.header.searchBox.assertNoSuggestions();

      page.header.searchBox.type('nsington');
      page.header.searchBox.suggestions.should('contain', 'Kensington');

      page.header.searchBox.enter();
    });
  });

  // currently not working, because typing tab is not supported by cypress
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should follow search when hitting enter with choosing suggestion with keyboard', () => {
    at(HomePage, page => {
      page.header.searchBox.type('ke');
      page.header.searchBox.suggestions.should('contain', 'Kensington');

      page.header.searchBox.tab().enter();
    });
  });

  it('should follow search when choosing suggestion with mouse', () => {
    at(HomePage, page => {
      page.header.searchBox.type('ken');
      page.header.searchBox.suggestions.should('contain', 'Kensington');

      page.header.searchBox.clickSuggestion('Kensington');
    });
  });

  it('should follow search when using buttons with mouse', () => {
    at(HomePage, page => {
      page.header.searchBox.clearButton.should('not.exist');
      page.header.searchBox.searchButton.should('be.visible');

      page.header.searchBox.type('Ken');
      page.header.searchBox.suggestions.should('contain', 'Kensington');

      page.header.searchBox.type('asdf');
      page.header.searchBox.assertNoSuggestions();

      page.header.searchBox.clearButton.should('be.visible');
      page.header.searchBox.clearButton.click();

      page.header.searchBox.text.should('be.empty');
      page.header.searchBox.assertNoSuggestions();

      // clicking search now should not do anything
      page.header.searchBox.searchButton.click();
      at(HomePage);

      page.header.searchBox.type('kensington');

      page.header.searchBox.searchButton.should('be.visible');
      page.header.searchBox.searchButton.click();
    });
  });

  it('should properly track displaying suggestion focus', () => {
    at(HomePage, page => {
      page.header.searchBox.type('ke');
      page.header.searchBox.suggestions.should('contain', 'Kensington');

      page.header.searchBox.esc();

      page.header.searchBox.assertNoSuggestions();

      page.header.searchBox.focus();

      page.header.searchBox.assertNoSuggestions();

      page.header.searchBox.type('kensington');
      page.header.searchBox.suggestions.should('contain', 'Kensington');

      page.header.gotoHomePage();
      waitLoadingEnd(2000);

      page.header.searchBox.assertSuggestionsNoDisplayed();

      page.header.searchBox.focus();
      page.header.searchBox.suggestions.should('contain', 'Kensington');

      page.header.searchBox.clickSuggestion('Kensington');
    });
  });
});

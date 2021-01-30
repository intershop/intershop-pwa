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
      page.title.should('contain', 'kodak');
      page.title.should('contain', '23 items');
      page.header.searchBox.text.should('equal', 'kodak');
      page.header.searchBox.assertNoSuggestions();
    });

    back();

    at(HomePage, page => page.header.searchBox.clear());
  });

  it('should display suggest overlay when typing and follow when entering', () => {
    at(HomePage, page => {
      page.header.searchBox.type('k');
      page.header.searchBox.suggestions.should('contain', 'Kensington');

      page.header.searchBox.type('e');
      page.header.searchBox.suggestions.should('contain', 'Kensington');

      page.header.searchBox.backspace();
      page.header.searchBox.suggestions.should('contain', 'Kensington');

      page.header.searchBox.type('o');
      page.header.searchBox.suggestions.should('contain', 'Kodak');

      page.header.searchBox.type('dak');
      page.header.searchBox.suggestions.should('contain', 'Kodak');

      page.header.searchBox.enter();
    });
  });

  it('should follow search when hitting enter with choosing suggestion with keyboard', () => {
    at(HomePage, page => {
      page.header.searchBox.type('ko');
      page.header.searchBox.suggestions.should('contain', 'Kodak');

      page.header.searchBox.down().enter();
    });
  });

  it('should follow search when choosing suggestion with mouse', () => {
    at(HomePage, page => {
      page.header.searchBox.type('kod');
      page.header.searchBox.suggestions.should('contain', 'Kodak');

      page.header.searchBox.clickSuggestion('Kodak');
    });
  });

  it('should follow search when using buttons with mouse', () => {
    at(HomePage, page => {
      page.header.searchBox.clearButton.should('not.exist');
      page.header.searchBox.searchButton.should('be.visible');

      page.header.searchBox.type('ko');
      page.header.searchBox.suggestions.should('contain', 'Kodak');

      page.header.searchBox.type('asdf');
      page.header.searchBox.assertNoSuggestions();

      page.header.searchBox.clearButton.should('be.visible');
      page.header.searchBox.clearButton.click();

      page.header.searchBox.text.should('be.empty');
      page.header.searchBox.assertNoSuggestions();

      // clicking search now should not do anything
      page.header.searchBox.searchButton.click();
      at(HomePage);

      page.header.searchBox.type('kodak');
      page.header.searchBox.suggestions.should('contain', 'Kodak');

      page.header.searchBox.searchButton.should('be.visible');
      page.header.searchBox.searchButton.click();
    });
  });

  it('should properly track displaying suggestion focus', () => {
    at(HomePage, page => {
      page.header.searchBox.type('ko');
      page.header.searchBox.suggestions.should('contain', 'Kodak');

      page.header.searchBox.esc();

      page.header.searchBox.assertNoSuggestions();

      page.header.searchBox.focus();

      page.header.searchBox.assertNoSuggestions();

      page.header.searchBox.type('d');
      page.header.searchBox.suggestions.should('contain', 'Kodak');

      page.header.gotoHomePage();
      waitLoadingEnd(2000);

      page.header.searchBox.assertNoSuggestions();

      page.header.searchBox.type('a');
      page.header.searchBox.suggestions.should('contain', 'Kodak');

      page.header.searchBox.clickSuggestion('Kodak');
    });
  });
});

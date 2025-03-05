import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { SearchResultPage } from '../../pages/shopping/search-result.page';

const _ = {
  suggestTerm: 'gop',
  searchTerm: 'gopro',
  suggestItemText: 'Gopro',
  results: 6,
  filter: {
    name: 'Price',
    entryName: 'ProductSalePriceGross_250_0_TO_499_99',
    results: 3,
  },
};

describe('Searching User', () => {
  before(() => HomePage.navigateTo());

  it('should enter search term and wait for displayed suggestions', () => {
    at(HomePage, page => {
      page.header.searchBox.type(_.suggestItemText);
      page.header.searchBox.suggestions.should('contain', _.suggestItemText);
    });
  });

  it('should perform search and land on search result page', () => {
    at(HomePage, page => {
      page.header.searchBox.esc();
      page.header.searchBox.search(_.suggestItemText);
    });
    at(SearchResultPage);
  });

  it('should see results on search result page', () => {
    at(SearchResultPage, page => page.productList.visibleProducts.should('have.length.gte', 1));
  });

  it('should see the correct filter', () => {
    at(SearchResultPage, page => {
      page.filterNavigation.filter('Color').getFilter('Silver').should('be.visible');

      page.filterNavigation
        .filter(_.filter.name)
        .getFilter(_.filter.entryName)
        .should('contain', `(${_.filter.results})`);
    });
  });

  it('should filter products by price', () => {
    at(SearchResultPage, page => page.filterNavigation.filter(_.filter.name).filterClick(_.filter.entryName));
  });

  it(`should see other results in search result page`, () => {
    at(SearchResultPage, page => page.productList.numberOfItems.should('equal', _.filter.results));
  });

  it('should deselect filter', () => {
    at(SearchResultPage, page => page.filterNavigation.filter(_.filter.name).filterClick(_.filter.entryName));
  });

  it(`should see other results in search result page`, () => {
    at(SearchResultPage, page => page.productList.numberOfItems.should('equal', _.results));
  });
});

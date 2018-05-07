import { browser } from 'protractor';
import { at } from '../framework';
import { HomePage } from '../pages/home.page';
import { SearchResultPage } from '../pages/shopping/search-result.page';

describe('Searching User', () => {
  beforeAll(() => HomePage.navigateTo());

  it('should enter search term and wait for displayed suggestions', () => {
    at(HomePage, page => {
      expect(page.header.getSearchSuggestions('k')).toContain('Kodak');
    });
  });

  it('should perform search and land on search result page', () => {
    at(HomePage, page => {
      page.header.productSearch('kodak');
    });
    at(SearchResultPage);
  });

  it('should see results on search result page', () => {
    at(SearchResultPage, page => {
      expect(page.getVisibleProductsCount()).toBeGreaterThanOrEqual(1);
    });
  });
});

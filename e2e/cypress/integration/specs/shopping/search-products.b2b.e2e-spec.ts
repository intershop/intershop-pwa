import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';
import { SearchResultPage } from '../../pages/shopping/search-result.page';

const _ = {
  suggestTerm: 'bel',
  suggestItemText: 'Belkin',
  searchTerm: 'belkin n',
  product: '10802812',
};

describe('Searching B2B User', () => {
  before(() => HomePage.navigateTo());

  it('should enter search term and wait for displayed suggestions', () => {
    at(HomePage, page => {
      page.header.searchBox.type(_.suggestTerm);
      page.header.searchBox.suggestions.should('contain', _.suggestItemText);
    });
  });

  it('should perform search and land on search result page', () => {
    at(HomePage, page => page.header.searchBox.search(_.searchTerm));
    at(SearchResultPage);
  });

  it('should see results on search result page', () => {
    at(SearchResultPage, page => page.productList.visibleProducts.should('have.length.gte', 1));
  });

  it(`should click and end on product detail page to check product data`, () => {
    at(SearchResultPage, page => page.productList.gotoProductDetailPageBySku(_.product));
    at(ProductDetailPage, page => {
      page.sku.should('have.text', _.product);
      page.breadcrumb.items.should('have.length', 4);
    });
  });
});

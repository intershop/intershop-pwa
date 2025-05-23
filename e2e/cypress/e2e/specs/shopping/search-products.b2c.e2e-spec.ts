import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';
import { SearchResultPage } from '../../pages/shopping/search-result.page';

const _ = {
  suggestTerm: 'ken',
  suggestItemText: 'kensington',
  searchTerm: 'Kensington K55786WW',
  product: '5800646',
  searchTermWithMoreResults: 'acer',
  searchTermWithOneResult: 'acer c110',
  oneResultProduct: '9438012',
};

describe('Searching User', () => {
  before(() => HomePage.navigateTo());

  it('should enter search term and wait for displayed suggestions', () => {
    at(HomePage, page => {
      page.header.searchBox.type(_.suggestTerm);
      page.header.searchBox.suggestions.should('contain', _.suggestItemText);
    });
  });

  it('should perform search and land on search result page', () => {
    at(HomePage, page => page.header.searchBox.search(_.suggestItemText));
    at(SearchResultPage);
  });

  it('should see results on search result page', () => {
    at(SearchResultPage, page => page.productList.visibleProducts.should('have.length.gte', 1));
  });

  it(`should click and end on product detail page to check product data`, () => {
    at(SearchResultPage, page => page.productList.gotoProductDetailPageBySku(_.product));
    at(ProductDetailPage, page => {
      page.sku.should('have.text', _.product);
      page.breadcrumb.items.should('have.length', 5);
    });
  });

  it(`should perform another search and land on search result page`, () => {
    at(ProductDetailPage, page => page.header.searchBox.search(_.searchTermWithMoreResults));
    at(SearchResultPage, page => page.productList.visibleProducts.should('have.length.gte', 1));
  });

  it(`should perform search with only one search result and land on product detail page`, () => {
    at(SearchResultPage, page => page.header.searchBox.search(_.searchTermWithOneResult));
    at(ProductDetailPage, page => {
      page.sku.should('have.text', _.oneResultProduct);
    });
  });
});

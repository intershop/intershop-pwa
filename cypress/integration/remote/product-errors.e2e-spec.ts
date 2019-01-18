import { at, waitLoadingEnd } from '../framework';
import { LoginPage } from '../pages/account/login.page';
import { HomePage } from '../pages/home.page';
import { NotFoundPage } from '../pages/shopping/not-found.page';
import { ProductDetailPage } from '../pages/shopping/product-detail.page';
import { SearchResultPage } from '../pages/shopping/search-result.page';

describe('Deleted Products', () => {
  beforeEach(() => {
    cy.server();
  });

  describe('in CMS managed content', () => {
    before(() => {
      LoginPage.navigateTo();

      cy.route({
        method: 'GET',
        url: '**/products/201807194*',
        status: 404,
        response: {},
      });
    });

    it('should not lead to complete redirect to error page', () => {
      at(LoginPage, page => {
        page.header.gotoHomePage();
      });
      waitLoadingEnd();
      at(HomePage);
    });
  });

  describe('in Product Lists', () => {
    before(() => {
      HomePage.navigateTo();

      cy.route({
        method: 'GET',
        url: '**/products/3957279*',
        status: 404,
        response: {},
      });
    });

    it('should not lead to complete redirect to error page', () => {
      at(HomePage, page => {
        page.header.doProductSearch('kodak');
      });
      at(SearchResultPage, page => {
        page.productList.visibleProducts.should('have.length.gte', 1);
        page.filterNavigation.filter('Color').filterClick('Red');
      });
      waitLoadingEnd();
      at(SearchResultPage, page => {
        page.productList.visibleProducts.should('have.length.gte', 1);
      });
    });
  });

  describe('on Product Detail Page', () => {
    it('should lead straight to error page', () => {
      ProductDetailPage.navigateTo('ERROAR');
      at(NotFoundPage);
    });
  });
});

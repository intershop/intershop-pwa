import { at, waitLoadingEnd } from '../../framework';
import { LoginPage } from '../../pages/account/login.page';
import { HomePage } from '../../pages/home.page';
import { ServerErrorPage } from '../../pages/server-error.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { NotFoundPage } from '../../pages/shopping/not-found.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';
import { SearchResultPage } from '../../pages/shopping/search-result.page';

const _ = {
  catalog: 'Cameras-Camcorders',
  categoryid: 'Cameras-Camcorders.584',
};

describe('Missing Data', () => {
  describe('server error when getting CMS managed content', () => {
    before(() => {
      LoginPage.navigateTo();

      cy.server().route({
        method: 'GET',
        url: '**/cms/**',
        status: 500,
        response: '',
      });
    });

    it('should lead to server error page', () => {
      at(LoginPage, page => {
        page.header.gotoHomePage();
      });
      waitLoadingEnd();
      at(ServerErrorPage);
    });
  });

  describe('error when getting CMS managed content', () => {
    before(() => {
      LoginPage.navigateTo();

      cy.server().route({
        method: 'GET',
        url: '**/cms/**',
        status: 404,
        response: '',
      });
    });

    it('should not lead to error page', () => {
      at(LoginPage, page => {
        page.header.gotoHomePage();
      });
      waitLoadingEnd();
      at(HomePage);
    });
  });

  describe('of products in CMS managed content', () => {
    before(() => {
      LoginPage.navigateTo();

      cy.server().route({
        method: 'GET',
        url: '**/products/201807194*',
        status: 404,
        response: '',
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

  describe('of products in Product Lists', () => {
    before(() => {
      HomePage.navigateTo();

      cy.server().route({
        method: 'GET',
        url: '**/products/3957279*',
        status: 404,
        response: '',
      });
    });

    it('should not lead to complete redirect to error page', () => {
      at(HomePage, page => {
        page.header.searchBox.search('kodak');
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

  describe('of product on Product Detail Page', () => {
    it('should lead straight to error page', () => {
      ProductDetailPage.navigateTo('ERROAR');
      at(NotFoundPage);
    });
  });

  describe('error when retrieving Products on Family Page', () => {
    before(() => {
      HomePage.navigateTo();

      cy.server().route({
        method: 'GET',
        url: '**/products*',
        status: 404,
        response: '',
      });
    });

    it('should lead straight to error page', () => {
      at(HomePage, page => page.header.gotoCategoryPage(_.catalog));
      at(CategoryPage, page => page.gotoSubCategory(_.categoryid));
      at(NotFoundPage);
    });
  });

  describe('of category on Category Page', () => {
    it('should lead straight to error page', () => {
      FamilyPage.navigateTo('ERROAR');
      at(NotFoundPage);
    });
  });
});

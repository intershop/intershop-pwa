import { at, waitLoadingEnd } from '../../framework';
import { FamilyPage } from '../../pages/shopping/family.page';

const _ = {
  category: 'Computers.106.830.1307',
  items: 30,
};

describe('Scrolling User', () => {
  before(() => FamilyPage.navigateTo(_.category));

  it('should not see all product tiles available in that category', () => {
    at(FamilyPage, page => {
      page.productList.numberOfItems.should('equal', _.items);
      page.productList.visibleProducts.should('not.have.length', _.items);
    });
  });

  it('should see paging information on page', () => {
    at(FamilyPage, page => {
      page.productList.currentPage.should('equal', 1);
      cy.scrollTo('bottom');
      waitLoadingEnd();
      page.productList.currentPage.should('equal', 2);
    });
  });

  it('should scroll all the way down and not see paging bar any more', () => {
    at(FamilyPage, page => {
      page.productList.makeAllProductsVisible();
      page.productList.pagingBar.should('not.exist');
    });
  });

  it('should now see all product tiles on page', () => {
    at(FamilyPage, page => {
      page.productList.visibleProducts.should('have.length', _.items);
    });
  });
});

describe('Google Page Crawler', () => {
  it('should be able to follow different pages', () => {
    FamilyPage.navigateTo(_.category);

    at(FamilyPage, page => {
      page.productList.currentPage.should('equal', 1);

      page.productList.firstVisibleProductSKU.then(firstPageTopSKU => {
        FamilyPage.navigateTo(_.category, 4);
        waitLoadingEnd();

        page.productList.currentPage.should('equal', 4);

        page.productList.firstVisibleProductSKU.should('not.equal', firstPageTopSKU);

        FamilyPage.navigateTo(_.category, 1);
        waitLoadingEnd();

        page.productList.currentPage.should('equal', 1);

        page.productList.firstVisibleProductSKU.should('equal', firstPageTopSKU);
      });
    });
  });
});

describe('Pagination & endless scroll', () => {
  it('should be able to follow different pages started at page 2', () => {
    FamilyPage.navigateTo(_.category, 2);

    at(FamilyPage, page => {
      page.productList.currentPage.should('equal', 2);

      cy.scrollTo('bottom');
      waitLoadingEnd();
      page.productList.currentPage.should('equal', 3);

      cy.scrollTo('bottom');
      waitLoadingEnd();
      page.productList.currentPage.should('equal', 4);
    });
  });
});

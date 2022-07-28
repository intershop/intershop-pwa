import { at } from '../../framework';
import { ComparePage } from '../../pages/shopping/compare.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  category: 'Home-Entertainment.SmartHome',
  product1: '201807171',
  product2: '201807191',
};

describe('Comparing User', () => {
  before(() => FamilyPage.navigateTo(_.category));

  it('should start at family page to get an overview', () => {
    at(FamilyPage, page => {
      page.header.numberOfCompareItems.should('equal', 0);
    });
  });

  it(`should choose first item from family page to compare with other items by clicking the toggle compare on product tile`, () => {
    at(FamilyPage, page => {
      page.productList.addProductToCompareBySku(_.product1);
      page.header.numberOfCompareItems.should('equal', 1);
    });
  });

  it(`should select the second camera and add it to compare on the product detail page`, () => {
    at(FamilyPage, page => {
      page.productList.gotoProductDetailPageBySku(_.product2);
    });

    at(ProductDetailPage, page => {
      page.sku.should('have.text', _.product2);
      page.addProductToCompare();
      page.header.numberOfCompareItems.should('equal', 2);
    });
  });

  it('should now be at the compare page to compare 2 products', () => {
    at(ComparePage, page => {
      page.visibleCompareItemSKUs.should('have.length', 2).should('contain', _.product1).should('contain', _.product2);
    });
  });
});

import { at } from '../framework';
import { ComparePage } from '../pages/shopping/compare.page';
import { FamilyPage } from '../pages/shopping/family.page';
import { ProductDetailPage } from '../pages/shopping/product-detail.page';

describe('Comparing User', () => {
  beforeAll(() => FamilyPage.navigateTo('Cameras-Camcorders.584'));

  it('should start at family page to get an overview', () => {
    at(FamilyPage, page => {
      expect(page.header.getNumberOfCompareItems()).toEqual(0);
    });
  });

  it(`should choose first item from family page to compare with other items by clicking the toggle compare on product tile`, () => {
    at(FamilyPage, page => {
      page.productList.addProductToCompareBySku('3953312');
      expect(page.header.getNumberOfCompareItems()).toEqual(1);
    });
  });

  it(`should select the second camera and add it to compare on the product detail page`, () => {
    at(FamilyPage, page => {
      page.productList.gotoProductDetailPageBySku('7912061');
    });

    at(ProductDetailPage, page => {
      expect(page.getSku()).toBe('7912061');
      page.addProductToCompare();
      expect(page.header.getNumberOfCompareItems()).toEqual(2);
    });
  });

  it('should now be at the compare page to compare 2 products', () => {
    at(ComparePage, page => {
      expect(page.getVisibleCompareItemSKUs()).toEqual(['3953312', '7912061']);
    });
  });
});

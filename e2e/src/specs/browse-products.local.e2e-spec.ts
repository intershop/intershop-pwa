import { at } from '../framework';
import { HomePage } from '../pages/home.page';
import { CategoryPage } from '../pages/shopping/category.page';
import { FamilyPage } from '../pages/shopping/family.page';
import { ProductDetailPage } from '../pages/shopping/product-detail.page';

describe('Browsing User', () => {
  describe('starting at home page', () => {
    beforeAll(() => HomePage.navigateTo());

    it(`should go from home page to category page`, () => {
      at(HomePage, page => {
        expect(page.getContent()).toContain('Cameras');
        page.gotoCategoryPage('Cameras-Camcorders');
      });
    });

    it(`should navigate through sub categories to family page`, () => {
      at(CategoryPage, page => {
        expect(page.getSubCategoryCount()).toBe(6);
        page.gotoSubCategory('Cameras-Camcorders.584');
      });
      at(FamilyPage, page => {
        expect(page.productList.getVisibleProductsCount()).toBeGreaterThanOrEqual(2);
      });
    });

    it(`should end on product detail page to check product price`, () => {
      at(FamilyPage, page => {
        page.productList.gotoProductDetailPageBySku('3953312');
      });
      at(ProductDetailPage, page => {
        expect(page.getSku()).toBe('3953312');
        expect(page.getPrice()).toBe('$303.62');
      });
    });
  });

  describe('starting at product detail page', () => {
    beforeAll(() => {
      ProductDetailPage.navigateTo('Cameras-Camcorders.584', '3953312');
    });

    it('should be at product detail page to check product price', () => {
      at(ProductDetailPage, page => {
        expect(page.getSku()).toBe('3953312');
        expect(page.getPrice()).toBe('$303.62');
      });
    });

    it('should navigate to family page to check sibling products', () => {
      at(ProductDetailPage, page => {
        expect(page.breadcrumb.noOfItems).toBe(4);
        expect(page.breadcrumb.getItem(2).getText()).toContain('CAMCORDERS');
        page.breadcrumb.getItem(2).click();
      });

      at(FamilyPage, page => {
        expect(page.productList.getVisibleProductsCount()).toBeGreaterThanOrEqual(2);
      });
    });
  });
});

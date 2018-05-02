import { at } from '../framework';
import { HomePage } from '../pages/home.page';
import { CategoryPage } from '../pages/shopping/category.page';
import { FamilyPage } from '../pages/shopping/family.page';
import { ProductDetailPage } from '../pages/shopping/product-detail.page';

describe('Browsing User', () => {
  beforeAll(() => HomePage.navigateTo());

  it(`should go from home page to category page`, () => {
    at(HomePage, page => {
      expect(page.getContent()).toContain('Cameras');
      page.gotoCategoryPage('Cameras-Camcorders-link');
    });
  });

  it(`should navigate through sub categories to family page`, () => {
    at(CategoryPage, page => {
      expect(page.getSubCategoryCount()).toBe(6);
      page.gotoSubCategory('category-584');
    });
    at(FamilyPage, page => {
      expect(page.getVisibleProductsCount()).toBe(2);
    });
  });

  it(`should end on product detail page to check product price`, () => {
    at(FamilyPage, page => {
      page.gotoProductDetailPageBySku('3953312');
    });
    at(ProductDetailPage, page => {
      expect(page.getSku()).toBe('3953312');
      expect(page.getPrice()).toBe('$303.62');
    });
  });
});

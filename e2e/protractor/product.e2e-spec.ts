import { at } from './make-protractor-great-again';
import { CategoryPage } from './pages/category.page';
import { FamilyPage } from './pages/family.page';
import { HomePage } from './pages/home.page';
import { ProductDetailPage } from './pages/product-detail.page';

describe('Browsing User', () => {
  beforeAll(() => HomePage.navigateTo());

  it(`should go from HomePage to CategoryPage`, () => {
    at(HomePage, page => {
      expect(page.getContent()).toContain('Cameras');
      page.gotoCategoryPage('Cameras-Camcorders-link');
    });
  });

  it(`should navigate through Subcategories`, () => {
    at(CategoryPage, page => {
      expect(page.getSubCategoryCount()).toBe(6);
      page.gotoSubCategory('category-584');
    });
    at(FamilyPage, page => {
      expect(page.getVisibleProductsCount()).toBe(2);
    });
  });

  it(`should end on ProductDetailPage from FamilyPage`, () => {
    at(FamilyPage, page => {
      page.gotoProductDetailPageBySku('3953312');
    });
    at(ProductDetailPage, page => {
      expect(page.isComplete()).toBe(true);
      expect(page.getSku()).toBe('3953312');
      expect(page.getPrice()).toBe('$303.62');
    });
  });
});

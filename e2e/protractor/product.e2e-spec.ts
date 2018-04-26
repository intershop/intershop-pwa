import { browser } from 'protractor';
import { FamilyPage } from './pages/family.page';
import { HomePage } from './pages/home.page';

describe('proof-of-concept App', () => {
  beforeAll(() => browser.waitForAngularEnabled(false));

  it(`should support navigating through Categories`, () => {
    const page = HomePage.navigateTo();
    expect(page.getContent()).toContain('Cameras');

    const categroyPage = page.gotoCategoryPage('Cameras-Camcorders-link');
    expect(categroyPage.getSubCategoryCount()).toBe(6);

    const familyPage = categroyPage.gotoSubCategory('category-584') as FamilyPage;
    expect(familyPage.getVisibleProductsCount()).toBe(2);
  });

  it(`should support clicking a Product in Family page to reach Product Detail Page`, () => {
    const familyPage = FamilyPage.navigateTo('Cameras-Camcorders.584');
    expect(familyPage.getVisibleProductsCount()).toBe(2);

    const productPage = familyPage.gotoProductDetailPageBySku('3953312');
    expect(productPage.isComplete()).toBe(true);

    expect(productPage.getSku()).toBe('3953312');
    expect(productPage.getPrice()).toBe('$303.62');
  });

  afterAll(() => browser.waitForAngularEnabled(true));
});

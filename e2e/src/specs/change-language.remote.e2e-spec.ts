import { at } from '../framework';
import { HomePage } from '../pages/home.page';
import { FamilyPage } from '../pages/shopping/family.page';
import { ProductDetailPage } from '../pages/shopping/product-detail.page';

describe('Language Changing User', () => {
  describe('starting at home page', () => {
    beforeAll(() => HomePage.navigateTo());

    it('should see english categories', () => {
      at(HomePage, page => {
        const link = page.header.getTopLevelCategory('Cameras-Camcorders');
        expect(link).toBeTruthy();
        expect(link.getText()).toContain('CAMERAS');
      });
    });

    it('when switching to german', () => {
      at(HomePage, page => {
        page.header.switchLanguage('German');
      });
    });

    it('should see german categories', () => {
      at(HomePage, page => {
        const link = page.header.getTopLevelCategory('Cameras-Camcorders');
        expect(link).toBeTruthy();
        expect(link.getText()).toContain('KAMERAS');
      });
    });
  });

  describe('starting at product detail page', () => {
    beforeAll(() => ProductDetailPage.navigateTo('Cameras-Camcorders.584', '3953312'));

    it('should see dollar prices', () => {
      at(ProductDetailPage, page => {
        expect(page.getPrice()).toBe('$303.62');
      });
    });

    it('should see english categories', () => {
      at(ProductDetailPage, page => {
        const link = page.header.getTopLevelCategory('Cameras-Camcorders');
        expect(link).toBeTruthy();
        expect(link.getText()).toContain('CAMERAS');
      });
    });

    it('when switching to german', () => {
      at(ProductDetailPage, page => {
        page.header.switchLanguage('German');
      });
    });

    it('should see euro prices', () => {
      at(ProductDetailPage, page => {
        expect(page.getPrice()).toBe('227,05 €');
      });
    });

    xit('should see german categories', () => {
      at(ProductDetailPage, page => {
        const link = page.header.getTopLevelCategory('Cameras-Camcorders');
        expect(link).toBeTruthy();
        expect(link.getText()).toContain('KAMERAS');
      });
    });
  });

  describe('starting at family page', () => {
    beforeAll(() => FamilyPage.navigateTo('Cameras-Camcorders.584'));

    it('should see dollar prices', () => {
      at(FamilyPage, page => {
        expect(page.productList.getProductTile('3953312').getText()).toContain('$303.62');
      });
    });

    it('should see english categories', () => {
      at(FamilyPage, page => {
        const link = page.header.getTopLevelCategory('Cameras-Camcorders');
        expect(link).toBeTruthy();
        expect(link.getText()).toContain('CAMERAS');
      });
    });

    it('when switching to german', () => {
      at(FamilyPage, page => {
        page.header.switchLanguage('German');
      });
    });

    xit('should see euro prices', () => {
      at(FamilyPage, page => {
        expect(page.productList.getProductTile('3953312').getText()).toContain('227,05 €');
      });
    });

    xit('should see german categories', () => {
      at(FamilyPage, page => {
        const link = page.header.getTopLevelCategory('Cameras-Camcorders');
        expect(link).toBeTruthy();
        expect(link.getText()).toContain('KAMERAS');
      });
    });
  });
});

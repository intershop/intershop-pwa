import { CategoryFactory } from './category.factory';
import { CategoryData } from './category.interface';
import { Category } from './category.model';


describe('CategoryFactory', () => {
  describe('fromData', () => {
    it(`should return Category when getting a RawCategory`, () => {
      expect(CategoryFactory.fromData({ id: '1' } as CategoryData)).toBeTruthy();

    });

    it(`should throw error when getting no RawCategory`, () => {
      expect(function() { CategoryFactory.fromData(null); }).toThrow();
    });

    it(`should handle Subcategories on RawCategory`, () => {
      const category: Category = CategoryFactory.fromData({ id: '1', subCategories: [{ id: '2' } as CategoryData], subCategoriesCount: 1 } as CategoryData);
      expect(category).toBeTruthy();
      expect(category.subCategories).toBeTruthy();
      expect(category.subCategoriesCount).toBe(1);
    });
  });
});


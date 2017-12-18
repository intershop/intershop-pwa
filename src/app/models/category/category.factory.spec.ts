import { categoryFromRaw } from './category.factory';
import { RawCategory } from './category.interface';
import { Category } from './category.model';


describe('CategoryFactory', () => {
  describe('categoryFromRaw', () => {
    it(`should return Category when getting a RawCategory`, () => {
      expect(categoryFromRaw({ id: '1' } as RawCategory)).toBeTruthy();

    });

    it(`should throw error when getting no RawCategory`, () => {
      expect(function() { categoryFromRaw(null); }).toThrow();
    });

    it(`should handle Subcategories on RawCategory`, () => {
      const category: Category = categoryFromRaw({ id: '1', subCategories: [{ id: '2' } as RawCategory], subCategoriesCount: 1 } as RawCategory);
      expect(category).toBeTruthy();
      expect(category.subCategories).toBeTruthy();
      expect(category.subCategoriesCount).toBe(1);
    });
  });
});


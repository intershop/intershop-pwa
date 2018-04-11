import { CategoryData } from './category.interface';
import { CategoryMapper } from './category.mapper';
import { Category } from './category.model';

describe('CategoryFactory', () => {
  describe('fromData', () => {
    it(`should return Category when getting a RawCategory`, () => {
      expect(CategoryMapper.fromData({ id: '1' } as CategoryData)).toBeTruthy();
    });

    it(`should throw error when getting no RawCategory`, () => {
      expect(function() {
        CategoryMapper.fromData(null);
      }).toThrow();
    });

    it(`should handle Subcategories on RawCategory`, () => {
      const category: Category = CategoryMapper.fromData({
        id: '1',
        subCategories: [{ id: '2' } as CategoryData],
        subCategoriesCount: 1,
      } as CategoryData);
      expect(category).toBeTruthy();
      expect(category.subCategories).toBeTruthy();
      expect(category.subCategoriesCount).toBe(1);
    });

    it('should insert id as uniqueId on RawCategory when supplying no value', () => {
      const category = CategoryMapper.fromData({ id: '1' } as CategoryData);
      expect(category.uniqueId).toEqual(category.id);
    });

    it('should insert supplied uniqueId on RawCategory when supplying one', () => {
      const category = CategoryMapper.fromData({ id: '1' } as CategoryData, '2');
      expect(category.uniqueId).toEqual('2');
    });
  });
});

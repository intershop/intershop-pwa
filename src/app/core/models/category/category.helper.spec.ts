import { CategoryCompletenessLevel, CategoryHelper } from './category.helper';
import { Category } from './category.model';

describe('Category Helper', () => {
  describe('getCategoryPath', () => {
    it.each([
      [undefined, undefined],
      [undefined, ''],
      ['A', 'A'],
      ['A/B', 'A.B'],
      ['A/B/C', 'A.B.C'],
    ])(`should return '%s' when expanding '%s'`, (result, uniqueId) => {
      expect(CategoryHelper.getCategoryPath(uniqueId)).toEqual(result);
    });
  });

  describe('Category Helper', () => {
    it.each([
      [false, undefined],
      [false, {} as Category],
      [false, { completenessLevel: undefined } as Category],
      [false, { completenessLevel: 0 } as Category],
      [true, { completenessLevel: CategoryCompletenessLevel.Max } as Category],
      [true, { completenessLevel: CategoryCompletenessLevel.Max + 1 } as Category],
    ])(`should return %s when checking '%j'`, (result, category) => {
      expect(CategoryHelper.isCategoryCompletelyLoaded(category)).toEqual(result);
    });
  });
});

import * as using from 'jasmine-data-provider';

import { CategoryCompletenessLevel, CategoryHelper } from './category.helper';
import { Category } from './category.model';

describe('Category Helper', () => {
  describe('getCategoryPath', () => {
    function dataProvider() {
      return [
        { uniqueId: undefined, result: undefined },
        { uniqueId: '', result: undefined },
        { uniqueId: 'A', result: 'A' },
        { uniqueId: 'A.B', result: 'A/B' },
        { uniqueId: 'A.B.C', result: 'A/B/C' },
      ];
    }

    using(dataProvider, slice => {
      it(`should return '${slice.result}' when expanding '${slice.uniqueId}'`, () => {
        expect(CategoryHelper.getCategoryPath(slice.uniqueId)).toEqual(slice.result);
      });
    });
  });

  describe('isCategoryCompletelyLoaded', () => {
    function dataProvider() {
      return [
        { category: undefined, result: false },
        { category: {} as Category, result: false },
        { category: { completenessLevel: undefined } as Category, result: false },
        { category: { completenessLevel: 0 } as Category, result: false },
        { category: { completenessLevel: CategoryCompletenessLevel.Max } as Category, result: true },
        { category: { completenessLevel: CategoryCompletenessLevel.Max + 1 } as Category, result: true },
      ];
    }

    using(dataProvider, slice => {
      it(`should return ${slice.result} when checking '${JSON.stringify(slice.category)}'`, () => {
        expect(CategoryHelper.isCategoryCompletelyLoaded(slice.category)).toEqual(slice.result);
      });
    });
  });
});

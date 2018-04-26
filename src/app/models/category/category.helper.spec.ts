import * as using from 'jasmine-data-provider';
import { CategoryHelper } from './category.helper';
import { Category } from './category.model';

describe('Category Helper', () => {
  describe('equals', () => {
    const dataProvider = () => {
      const emptyCategory = {} as Category;
      const category1 = { uniqueId: '1' } as Category;
      const category2 = { uniqueId: '2' } as Category;
      const category3 = { name: 'dummy', uniqueId: '1' } as Category;
      const category4 = { name: 'other', uniqueId: '1' } as Category;
      const category5 = { name: 'd', uniqueId: '0' } as Category;
      return [
        { cat1: emptyCategory, cat2: undefined, result: false },
        { cat1: emptyCategory, cat2: null, result: false },
        { cat1: emptyCategory, cat2: emptyCategory, result: true },
        { cat1: category1, cat2: category1, result: true },
        { cat1: category2, cat2: category1, result: false },
        { cat1: emptyCategory, cat2: category1, result: false },
        { cat1: category1, cat2: emptyCategory, result: false },
        { cat1: category5, cat2: category1, result: false },
        { cat1: category1, cat2: category5, result: false },
        { cat1: category1, cat2: category3, result: true },
        { cat1: category3, cat2: category4, result: true },
      ];
    };

    using(dataProvider, slice => {
      it(`should return ${slice.result} when comparing '${JSON.stringify(slice.cat1)}' and '${JSON.stringify(
        slice.cat2
      )}'`, () => {
        expect(CategoryHelper.equals(slice.cat1, slice.cat2)).toBe(slice.result);
      });
    });
  });

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

  describe('getCategoryPathUniqueIds', () => {
    function dataProvider() {
      return [
        { uniqueId: undefined, result: undefined },
        { uniqueId: '', result: undefined },
        { uniqueId: 'A', result: ['A'] },
        { uniqueId: 'A.B', result: ['A', 'A.B'] },
        { uniqueId: 'A.B.C', result: ['A', 'A.B', 'A.B.C'] },
      ];
    }

    using(dataProvider, slice => {
      it(`should return ${slice.result} when expanding '${JSON.stringify(slice.uniqueId)}'`, () => {
        expect(CategoryHelper.getCategoryPathUniqueIds(slice.uniqueId)).toEqual(slice.result);
      });
    });
  });
});

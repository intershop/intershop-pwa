import * as using from 'jasmine-data-provider';
import { CategoryHelper } from './category.helper';
import { CategoryData } from './category.interface';
import { CategoryMapper } from './category.mapper';
import { Category } from './category.model';

describe('Category Helper', () => {
  describe('equals', () => {
    function dataProvider() {
      const emptyCategory = CategoryMapper.fromData({} as CategoryData);
      const category1 = CategoryMapper.fromData({ id: '1' } as CategoryData);
      const category2 = CategoryMapper.fromData({ id: '2' } as CategoryData);
      const category3 = CategoryMapper.fromData({ name: 'dummy', id: '1' } as CategoryData);
      const category4 = CategoryMapper.fromData({ name: 'other', id: '1' } as CategoryData);
      const category5 = CategoryMapper.fromData({ name: 'd', id: '0' } as CategoryData);
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
    }

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

  describe('getCategoryPathIds', () => {
    function dataProvider() {
      return [
        { uniqueId: undefined, result: undefined },
        { uniqueId: '', result: undefined },
        { uniqueId: 'A', result: ['A'] },
        { uniqueId: 'A.B', result: ['A.B', 'A'] },
        { uniqueId: 'A.B.C', result: ['A.B.C', 'A.B', 'A'] },
      ];
    }

    using(dataProvider, slice => {
      it(`should return ${slice.result} when expanding '${JSON.stringify(slice.uniqueId)}'`, () => {
        expect(CategoryHelper.getCategoryPathIds(slice.uniqueId)).toEqual(slice.result);
      });
    });
  });

  describe('isCategoryCompletelyLoaded', () => {
    function dataProvider() {
      return [
        { category: undefined, result: false },
        { category: {} as Category, result: false },
        { category: { hasOnlineSubCategories: true } as Category, result: false },
        { category: { hasOnlineSubCategories: false } as Category, result: true },
        { category: { hasOnlineSubCategories: true, subCategories: [] } as Category, result: false },
        { category: { hasOnlineSubCategories: true, subCategories: [{}] } as Category, result: true },
      ];
    }

    using(dataProvider, slice => {
      it(`should return ${slice.result} when checking '${JSON.stringify(slice.category)}'`, () => {
        expect(CategoryHelper.isCategoryCompletelyLoaded(slice.category)).toEqual(slice.result);
      });
    });
  });
});

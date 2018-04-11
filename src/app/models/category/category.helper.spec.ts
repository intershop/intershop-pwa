import * as using from 'jasmine-data-provider';
import { CategoryHelper } from './category.helper';
import { CategoryData } from './category.interface';
import { CategoryMapper } from './category.mapper';

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
});

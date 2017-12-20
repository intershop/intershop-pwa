import * as using from 'jasmine-data-provider';
import { categoryFromRaw } from './category.factory';
import { RawCategory } from './category.interface';

describe('Category', () => {
  describe('equals', () => {

    function dataProvider() {
      const emptyCategory = categoryFromRaw({} as RawCategory);
      const category1 = categoryFromRaw({ id: '1' } as RawCategory);
      const category2 = categoryFromRaw({ id: '2' } as RawCategory);
      const category3 = categoryFromRaw({ name: 'dummy', id: '1' } as RawCategory);
      const category4 = categoryFromRaw({ name: 'other', id: '1' } as RawCategory);
      const category5 = categoryFromRaw({ name: 'd', id: '0' } as RawCategory);
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

    using(dataProvider, (slice) => {
      it(`should return ${slice.result} when comparing '${JSON.stringify(slice.cat1)}' and '${JSON.stringify(slice.cat2)}'`, () => {
        expect(slice.cat1.equals(slice.cat2)).toBe(slice.result);
      });
    });
  });
});

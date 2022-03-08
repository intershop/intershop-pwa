import { StoreLocationHelper } from './store-location.helper';
import { StoreLocation } from './store-location.model';

describe('Store Location Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, { id: 'test' } as StoreLocation, undefined],
      [false, undefined, { id: 'test' } as StoreLocation],
      [false, { id: 'test' } as StoreLocation, { id: 'other' } as StoreLocation],
      [true, { id: 'test' } as StoreLocation, { id: 'test' } as StoreLocation],
    ])(`should return %s when comparing %j and %j`, (expected, o1, o2) => {
      expect(StoreLocationHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});

import { StoreHelper } from './store.helper';
import { Store } from './store.model';

describe('Store Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, { id: 'test' } as Store, undefined],
      [false, undefined, { id: 'test' } as Store],
      [false, { id: 'test' } as Store, { id: 'other' } as Store],
      [true, { id: 'test' } as Store, { id: 'test' } as Store],
    ])(`should return %s when comparing %j and %j`, (expected, o1, o2) => {
      expect(StoreHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});

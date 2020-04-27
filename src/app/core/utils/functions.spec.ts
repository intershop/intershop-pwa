import { arraySlices, mergeDeep } from './functions';

describe('Functions', () => {
  describe('arraySlices', () => {
    const arr = [1, 2, 3, 4, 5, 6];

    it('should return correctly sliced arrays of length 2', () => {
      expect(arraySlices(arr, 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
    });

    it('should return correctly sliced arrays of length 1', () => {
      expect(arraySlices(arr, 1)).toEqual([[1], [2], [3], [4], [5], [6]]);
    });

    it('should return correctly sliced arrays of length 3', () => {
      expect(arraySlices(arr, 3)).toEqual([[1, 2, 3], [4, 5, 6]]);
    });

    it('should return correctly sliced arrays of length 6', () => {
      expect(arraySlices(arr, 6)).toEqual([[1, 2, 3, 4, 5, 6]]);
    });

    it('should return truncated result for length 8', () => {
      expect(arraySlices(arr, 8)).toBeEmpty();
    });

    it('should return truncated result for length 4', () => {
      expect(arraySlices(arr, 4)).toEqual([[1, 2, 3, 4]]);
    });

    it('should return undefined when input is undefined or empty', () => {
      expect(arraySlices(undefined, 2)).toBeUndefined();
      expect(arraySlices([], 2)).toBeUndefined();
    });

    it('should return undefined when requested length is smaller than 1', () => {
      expect(arraySlices([1], 0)).toBeUndefined();
      expect(arraySlices([1], -1)).toBeUndefined();
    });
  });

  describe('mergeDeep', () => {
    it('should merge complex objects on input', () => {
      expect(mergeDeep({ a: 1, b: { c: 2 } }, { d: 4, b: { e: 5 } })).toMatchInlineSnapshot(`
        Object {
          "a": 1,
          "b": Object {
            "c": 2,
            "e": 5,
          },
          "d": 4,
        }
      `);
    });

    it('should override incoming objects on input', () => {
      expect(mergeDeep({ a: 1, b: { c: 2 }, d: 11 }, { a: 4, b: { c: 5 } })).toMatchInlineSnapshot(`
        Object {
          "a": 4,
          "b": Object {
            "c": 5,
          },
          "d": 11,
        }
      `);
    });
  });
});

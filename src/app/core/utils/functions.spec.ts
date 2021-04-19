import { arraySlices, isArrayEqual, mergeDeep, omit } from './functions';

describe('Functions', () => {
  describe('arraySlices', () => {
    const arr = [1, 2, 3, 4, 5, 6];

    it('should return correctly sliced arrays of length 2', () => {
      expect(arraySlices(arr, 2)).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });

    it('should return correctly sliced arrays of length 1', () => {
      expect(arraySlices(arr, 1)).toEqual([[1], [2], [3], [4], [5], [6]]);
    });

    it('should return correctly sliced arrays of length 3', () => {
      expect(arraySlices(arr, 3)).toEqual([
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });

    it('should return correctly sliced arrays of length 6', () => {
      expect(arraySlices(arr, 6)).toEqual([[1, 2, 3, 4, 5, 6]]);
    });

    it('should return correctly sliced arrays of length 8', () => {
      expect(arraySlices(arr, 8)).toEqual([[1, 2, 3, 4, 5, 6]]);
    });

    it('should return correctly sliced arrays of length 4', () => {
      expect(arraySlices(arr, 4)).toEqual([
        [1, 2, 3, 4],
        [5, 6],
      ]);
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

  describe('omit', () => {
    let input: object;

    beforeEach(() => {
      input = {
        a: 1,
        b: '2',
        c: true,
        d: false,
      };
    });

    it('should remove keys from object on input', () => {
      expect(omit(input, 'a', 'c')).toMatchInlineSnapshot(`
        Object {
          "b": "2",
          "d": false,
        }
      `);
    });

    it('should not modify original input when used', () => {
      omit(input, 'a', 'c');

      expect(input).toMatchInlineSnapshot(`
        Object {
          "a": 1,
          "b": "2",
          "c": true,
          "d": false,
        }
      `);
    });

    it('should return original object if input was falsy', () => {
      expect(omit(undefined, 'a')).toBeUndefined();
    });

    it('should return original object if input was array', () => {
      expect(omit(['a'], 'a')).toMatchInlineSnapshot(`
        Array [
          "a",
        ]
      `);
    });
  });

  describe('isArrayEqual', () => {
    const obj = {};

    it.each`
      array1       | array2       | isEqual
      ${undefined} | ${undefined} | ${true}
      ${undefined} | ${[]}        | ${false}
      ${undefined} | ${[1]}       | ${false}
      ${[]}        | ${undefined} | ${false}
      ${[1]}       | ${undefined} | ${false}
      ${[]}        | ${[]}        | ${true}
      ${[1]}       | ${[1]}       | ${true}
      ${[1, 2]}    | ${[2, 1]}    | ${false}
      ${[1, 2]}    | ${[1, 2]}    | ${true}
      ${[{}]}      | ${[{}]}      | ${false}
      ${[obj]}     | ${[obj]}     | ${true}
    `('should return $isEqual when comparing $array1 and $array2', ({ array1, array2, isEqual }) => {
      expect(isArrayEqual(array1, array2)).toEqual(isEqual);
    });
  });
});

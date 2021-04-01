import { filterState } from './ngrx-state-transfer';

describe('Ngrx State Transfer', () => {
  describe('filterState', () => {
    it('should omit keys starting with underscore when copying state (simple)', () => {
      const input = {
        a: 'A',
        _b: 'B',
        c: 'C',
        _d: 'D',
      };

      const output = {
        a: 'A',
        c: 'C',
      };

      expect(filterState(input)).toEqual(output);
    });

    it('should omit keys starting with underscore when copying state (advanced)', () => {
      const input = {
        a: 'A',
        b: {
          _x: 'X',
          y: 'Y',
        },
      };

      const output = {
        a: 'A',
        b: {
          y: 'Y',
        },
      };

      expect(filterState(input)).toEqual(output);
    });

    it('should omit keys starting with underscore when copying state (complex)', () => {
      const input = {
        a: 'A',
        _b: 'B',
        c: {
          x: 'X',
          _y: {
            a: 'A',
            b: 'B',
          },
          z: {
            a: ['A'],
            _b: 'B',
          },
        },
      };

      const output = {
        a: 'A',
        c: {
          x: 'X',
          z: {
            a: ['A'],
          },
        },
      };

      expect(filterState(input)).toEqual(output);
    });

    it('should be able to handle empty states', () => {
      expect(filterState({})).toBeEmpty();
    });

    it('should be able to handle undefined values', () => {
      const input: object = {
        a: undefined,
        b: {
          _x: undefined,
          y: 'Y',
        },
      };

      const output: object = {
        a: undefined,
        b: {
          y: 'Y',
        },
      };

      expect(filterState(input)).toEqual(output);
    });

    it('should be able to handle array values', () => {
      const input: object = {
        a: [],
        b: {
          _x: [],
          y: ['Y'],
        },
      };

      const output: object = {
        a: [],
        b: {
          y: ['Y'],
        },
      };

      expect(filterState(input)).toEqual(output);
    });
  });
});

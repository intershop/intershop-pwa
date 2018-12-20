import * as using from 'jasmine-data-provider';

import { AddressHelper } from './address.helper';
import { Address } from './address.model';

describe('Address Helper', () => {
  describe('equal', () => {
    using(
      [
        { add1: undefined, add2: undefined, expected: false },
        { add1: { id: '1' } as Address, add2: undefined, expected: false },
        { add1: undefined, add2: { id: '1' } as Address, expected: false },
        { add1: { id: '1' } as Address, add2: { id: '2' } as Address, expected: false },
        { add1: { id: '1' } as Address, add2: { id: '1' } as Address, expected: true },
      ],
      slice => {
        it(`should yield ${slice.expected} when comparing ${JSON.stringify(slice.add1)} and ${JSON.stringify(
          slice.add2
        )}`, () => {
          expect(AddressHelper.equal(slice.add1, slice.add2)).toBe(slice.expected);
        });
      }
    );
  });
});

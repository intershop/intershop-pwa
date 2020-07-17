import * as using from 'jasmine-data-provider';

import { RequisitionHelper } from './requisition.helper';
import { Requisition } from './requisition.model';

describe('Requisition Helper', () => {
  describe('equal', () => {
    using(
      [
        { o1: undefined, o2: undefined, expected: false },
        { o1: { id: 'test' } as Requisition, o2: undefined, expected: false },
        { o1: undefined, o2: { id: 'test' } as Requisition, expected: false },
        { o1: { id: 'test' } as Requisition, o2: { id: 'other' } as Requisition, expected: false },
        { o1: { id: 'test' } as Requisition, o2: { id: 'test' } as Requisition, expected: true },
      ],
      slice => {
        it(`should return ${slice.expected} when comparing ${JSON.stringify(slice.o1)} and ${JSON.stringify(
          slice.o2
        )}`, () => {
          expect(RequisitionHelper.equal(slice.o1, slice.o2)).toEqual(slice.expected);
        });
      }
    );
  });
});

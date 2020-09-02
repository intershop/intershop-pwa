import * as using from 'jasmine-data-provider';

import { OrganizationGroupHelper } from './organization-group.helper';
import { OrganizationGroup } from './organization-group.model';

describe('Organization Group Helper', () => {
  describe('equal', () => {
    using(
      [
        { o1: undefined, o2: undefined, expected: false },
        { o1: { id: 'test' } as OrganizationGroup, o2: undefined, expected: false },
        { o1: undefined, o2: { id: 'test' } as OrganizationGroup, expected: false },
        { o1: { id: 'test' } as OrganizationGroup, o2: { id: 'other' } as OrganizationGroup, expected: false },
        { o1: { id: 'test' } as OrganizationGroup, o2: { id: 'test' } as OrganizationGroup, expected: true },
      ],
      slice => {
        it(`should return ${slice.expected} when comparing ${JSON.stringify(slice.o1)} and ${JSON.stringify(
          slice.o2
        )}`, () => {
          expect(OrganizationGroupHelper.equal(slice.o1, slice.o2)).toEqual(slice.expected);
        });
      }
    );
  });
});

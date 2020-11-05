import { AddressHelper } from './address.helper';
import { Address } from './address.model';

describe('Address Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, { urn: '1' }, undefined],
      [false, undefined, { urn: '1' }],
      [false, { urn: '1' }, { urn: '2' }],
      [true, { urn: '1' }, { urn: '1' }],
      [false, { id: '1' }, { id: '2' }],
      [true, { id: '1' }, { id: '1' }],
      [false, { urn: '1', id: '1' }, { urn: '2', id: '1' }],
      [true, { urn: '1', id: '1' }, { urn: '1', id: '1' }],
      [true, { urn: '1', id: '1' }, { urn: '1', id: '2' }],
    ])('should yield %s when comparing %j and %j', (expected, add1: Address, add2: Address) => {
      expect(AddressHelper.equal(add1, add2)).toBe(expected);
    });
  });
});

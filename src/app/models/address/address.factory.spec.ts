import { FormControl, FormGroup } from '@angular/forms';
import { AddressFactory } from '../address/address.factory';
import { AddressData } from './address.interface';

describe('Address Factory', () => {
  describe('fromData', () => {
    it(`should return Address when getting a RawAddress`, () => {
      const address = AddressFactory.fromData({ firstName: 'John' } as AddressData);
      expect(address.firstName).toEqual('John');
    });
  });

  describe('fromFormToData', () => {
    const form = new FormGroup({
      firstName: new FormControl('John')
    });

    it(`should return address data when getting an address form`, () => {
      const address = AddressFactory.fromFormValueToData(form.value);
      expect(address.firstName).toEqual('John');
    });

    it(`should return null when getting no address form`, () => {
      expect(AddressFactory.fromFormValueToData(null)).toBeFalsy();
    });
  });
});


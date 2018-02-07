import { FormControl, FormGroup } from '@angular/forms';
import { AddressFactory } from '../address/address.factory';
import { AddressData } from './address.interface';
import { Address } from './address.model';

describe('Address Factory', () => {
  describe('fromData', () => {
    it(`should return Address when getting a RawAddress`, () => {
      const address = AddressFactory.fromData({ firstName: 'John' } as AddressData);
      expect(address.firstName).toEqual('John');
    });
  });

  describe('toData', () => {
    it(`should return AddressData when getting an Address`, () => {
      const address = new Address();
      address.firstName = 'John';
      const addressdata = AddressFactory.toData(address);
      expect(addressdata.firstName).toEqual('John', 'addressData first name is returned');
    });
  });

  describe('fromValue', () => {
    const form = new FormGroup({
      firstName: new FormControl('John')
    });

    it(`should return address data when getting an address form`, () => {
      const address = AddressFactory.fromValue(form.value);
      expect(address.firstName).toEqual('John');
      expect(address instanceof Address).toBeTruthy('address is an object of class Address');
    });

    it(`should return null when getting no address form`, () => {
      expect(AddressFactory.fromValue(null)).toBeFalsy();
    });
  });
});


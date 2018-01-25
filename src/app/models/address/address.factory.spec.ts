import { FormControl, FormGroup } from '@angular/forms';
import { AddressFactory } from '../address/address.factory';
import { AddressData } from './address.interface';

describe('Address Factory', () => {
  describe('fromData', () => {
    it(`should return Address when getting a RawAddress`, () => {
      expect(AddressFactory.fromData({ firstName: 'John' } as AddressData)).toBeTruthy();
    });
  });

  describe('fromForm', () => {
    const form = new FormGroup({
      firstName: new FormControl('John'),
      lastName: new FormControl('Doe')
    });

    it(`should return Address when getting an address form`, () => {
      expect(AddressFactory.fromForm(form)).toBeTruthy();
    });

    it(`should return null when getting no address form`, () => {
      expect(AddressFactory.fromForm(null)).toBeFalsy();
    });
  });
});


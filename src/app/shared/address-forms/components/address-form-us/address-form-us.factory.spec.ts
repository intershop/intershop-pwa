import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { AddressFormUSFactory } from './address-form-us.factory';

describe('Address Form Us Factory', () => {
  let addressFactory: AddressFormUSFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder, AddressFormUSFactory],
    });
    addressFactory = TestBed.get(AddressFormUSFactory);
  });

  it('should be created', () => {
    expect(addressFactory).toBeTruthy();
  });

  describe('group', () => {
    it('should return a default form group if called', () => {
      const fg = addressFactory.group();
      expect(fg.get('firstName')).toBeTruthy();
      expect(fg.get('lastName')).toBeTruthy();
      expect(fg.get('addressLine1')).toBeTruthy();
      expect(fg.get('addressLine2')).toBeTruthy();
      expect(fg.get('postalCode')).toBeTruthy();
      expect(fg.get('city')).toBeTruthy();
      expect(fg.get('mainDivision')).toBeTruthy();
      expect(fg.get('phoneHome')).toBeTruthy();
    });
  });
});

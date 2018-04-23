import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { AddressFormGBFactory } from './address-form-gb.factory';

describe('AddressFormDEFactory', () => {
  let addressFactory: AddressFormGBFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder, AddressFormGBFactory],
    });
    addressFactory = TestBed.get(AddressFormGBFactory);
  });

  it('should be created', () => {
    expect(addressFactory).toBeTruthy();
  });

  describe('group', () => {
    it('should return a GB form group if called', () => {
      const fg = addressFactory.group();
      expect(fg.get('title')).toBeTruthy();
      expect(fg.get('firstName')).toBeTruthy();
      expect(fg.get('lastName')).toBeTruthy();
      expect(fg.get('addressLine1')).toBeTruthy();
      expect(fg.get('addressLine2')).toBeTruthy();
      expect(fg.get('addressLine3')).toBeTruthy();
      expect(fg.get('postalCode')).toBeTruthy();
      expect(fg.get('city')).toBeTruthy();
      expect(fg.get('phoneHome')).toBeTruthy();
    });
  });
});

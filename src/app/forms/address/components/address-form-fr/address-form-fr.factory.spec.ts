import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { AddressFormFRFactory } from './address-form-fr.factory';

describe('Address Form Fr Factory', () => {
  let addressFactory: AddressFormFRFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder, AddressFormFRFactory],
    });
    addressFactory = TestBed.get(AddressFormFRFactory);
  });

  it('should be created', () => {
    expect(addressFactory).toBeTruthy();
  });

  describe('group', () => {
    it('should return a FR form group if called', () => {
      const fg = addressFactory.group();
      expect(fg.get('title')).toBeTruthy();
      expect(fg.get('firstName')).toBeTruthy();
      expect(fg.get('lastName')).toBeTruthy();
      expect(fg.get('addressLine1')).toBeTruthy();
      expect(fg.get('addressLine2')).toBeTruthy();
      expect(fg.get('postalCode')).toBeTruthy();
      expect(fg.get('city')).toBeTruthy();
      expect(fg.get('phoneHome')).toBeTruthy();
    });
  });
});

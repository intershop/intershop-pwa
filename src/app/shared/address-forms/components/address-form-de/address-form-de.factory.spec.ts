import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { AddressFormDEFactory } from './address-form-de.factory';

describe('Address Form De Factory', () => {
  let addressFactory: AddressFormDEFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder, AddressFormDEFactory],
    });
    addressFactory = TestBed.get(AddressFormDEFactory);
  });

  it('should be created', () => {
    expect(addressFactory).toBeTruthy();
  });

  describe('group', () => {
    it('should return a DE form group if called', () => {
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

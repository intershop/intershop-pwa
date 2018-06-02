import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { AddressFormDefaultFactory } from './address-form-default.factory';

describe('Address Form Default Factory', () => {
  let addressFactory: AddressFormDefaultFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder, AddressFormDefaultFactory],
    });
    addressFactory = TestBed.get(AddressFormDefaultFactory);
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
      expect(fg.get('state')).toBeTruthy();
      expect(fg.get('phoneHome')).toBeTruthy();
    });
  });

  describe('getGroup', () => {
    it('should return a form group if called and apply values to it', () => {
      const fg = addressFactory.getGroup({
        firstName: 'John',
        lastName: 'Doe',
        city: 'Denver',
      });
      expect(fg.get('firstName').value).toEqual('John');
      expect(fg.get('lastName').value).toEqual('Doe');
      expect(fg.get('city').value).toEqual('Denver');
    });
  });
});

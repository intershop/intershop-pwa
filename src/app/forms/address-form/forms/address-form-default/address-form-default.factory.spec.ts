import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { AddressFormDefaultFactory } from './address-form-default.factory';

describe('AddressFormDEFactory', () => {
  let addressFactory: AddressFormDefaultFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        AddressFormDefaultFactory
      ]
    });
    addressFactory = TestBed.get(AddressFormDefaultFactory);
  });

  it('should be created', () => {
    expect(addressFactory).toBeTruthy();
  });

  describe('group', () => {
    it('should return a default form group if called', () => {
      const fg = addressFactory.group();
      expect(fg.get('firstName')).toBeTruthy('form group contains firstname');
      expect(fg.get('lastName')).toBeTruthy('form group contains lastName');
      expect(fg.get('addressLine1')).toBeTruthy('form group contains addressLine1');
      expect(fg.get('addressLine2')).toBeTruthy('form group contains addressLine2');
      expect(fg.get('postalCode')).toBeTruthy('form group contains postalCode');
      expect(fg.get('city')).toBeTruthy('form group contains city');
      expect(fg.get('state')).toBeTruthy('form group contains state');
      expect(fg.get('phoneHome')).toBeTruthy('form group contains phoneHome');
    });
  });

  describe('getGroup', () => {
    it('should return a form group if called and apply values to it', () => {
      const fg = addressFactory.getGroup(
        {
          firstName: 'John',
          lastName: 'Doe',
          city: 'Denver'
        }
      );
      expect(fg.get('firstName').value).toEqual('John', 'firstName is set');
      expect(fg.get('lastName').value).toEqual('Doe', 'lastName is set');
      expect(fg.get('city').value).toEqual('Denver', 'city is set');
    });
  });
});

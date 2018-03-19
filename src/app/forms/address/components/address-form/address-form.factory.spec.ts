import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { AddressFormFactory } from './address-form.factory';

describe('AddressFormDEFactory', () => {
  let addressFactory: AddressFormFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        AddressFormFactory
      ]
    });
    addressFactory = TestBed.get(AddressFormFactory);
  });

  it('should be created', () => {
    expect(addressFactory).toBeTruthy();
  });

  describe('group', () => {
    it('should return an empty form group if called', () => {
      const fg = addressFactory.group();
      expect(fg).toBeTruthy('form group is created');
    });
  });
});

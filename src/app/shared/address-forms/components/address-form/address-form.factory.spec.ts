import { TestBed } from '@angular/core/testing';

import { AddressFormFactory } from './address-form.factory';

describe('Address Form Factory', () => {
  let addressFactory: AddressFormFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressFormFactory],
    });
    addressFactory = TestBed.inject(AddressFormFactory);
  });

  it('should be created', () => {
    expect(addressFactory).toBeTruthy();
  });

  describe('group', () => {
    it('should return an empty form group if called', () => {
      const fg = addressFactory.group();
      expect(fg).toBeTruthy();
    });
  });
});

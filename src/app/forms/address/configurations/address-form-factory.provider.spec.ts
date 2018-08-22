import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { AddressFormDEFactory } from '../components/address-form-de/address-form-de.factory';
import { AddressFormDefaultFactory } from '../components/address-form-default/address-form-default.factory';
import { ADDRESS_FORM_FACTORY } from '../components/address-form/address-form.factory';

import { AddressFormFactoryProvider } from './address-form-factory.provider';

describe('Address Form Factory Provider', () => {
  let addressFormService: AddressFormFactoryProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ADDRESS_FORM_FACTORY,
          useValue: [new AddressFormDefaultFactory(new FormBuilder()), new AddressFormDEFactory(new FormBuilder())],
        },
        AddressFormFactoryProvider,
      ],
    });
    addressFormService = TestBed.get(AddressFormFactoryProvider);
  });

  it('should be created', () => {
    expect(addressFormService).toBeTruthy();
  });

  describe('getFactory()', () => {
    it('should return Default address form factory if no countryCode is given', () => {
      expect(addressFormService.getFactory().countryCode).toEqual('default');
    });

    it('should return Default address form factory if country has no specific form', () => {
      expect(addressFormService.getFactory('BG').countryCode).toEqual('default');
    });

    it('should return German address form factory for countryCode DE', () => {
      expect(addressFormService.getFactory('DE').countryCode).toEqual('DE');
    });
  });
});

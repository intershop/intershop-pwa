import { AddressMockData } from 'ish-core/utils/dev/address-mock-data';

import { AddressFormBusinessHelper } from './address-form-business.helper';

describe('Address Form Business Helper', () => {
  describe('addControls', () => {
    it(`should add business form controls when getting an address form`, () => {
      const addressForm = AddressMockData.getAddressForm();

      AddressFormBusinessHelper.addControls(addressForm);
      expect(addressForm.get('companyName1')).toBeTruthy();
      expect(addressForm.get('companyName2')).toBeTruthy();
    });
  });
});

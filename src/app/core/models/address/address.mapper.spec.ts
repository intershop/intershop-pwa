import { AddressData } from './address.interface';
import { AddressMapper } from './address.mapper';

describe('Address Mapper', () => {
  describe('fromData', () => {
    it(`should return an Address when getting AddressData`, () => {
      const addressData = { id: 'addressId', addressLine1: 'High Street', street: 'Long Road' } as AddressData;
      const address = AddressMapper.fromData(addressData);

      expect(address).toBeTruthy();
      expect(address.id).toBe(addressData.id);
      expect(address.addressLine1).toBe(addressData.addressLine1);
    });
  });
});

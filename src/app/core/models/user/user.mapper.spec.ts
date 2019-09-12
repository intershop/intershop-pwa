import { Address } from 'ish-core/models/address/address.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { UserData } from './user.interface';
import { UserMapper } from './user.mapper';

describe('User Mapper', () => {
  describe('fromData', () => {
    it(`should return User when getting  UserData`, () => {
      const userData = {
        firstName: 'Patricia',
        lastName: 'Miller',
        preferredInvoiceToAddress: BasketMockData.getAddress(),
        preferredShipToAddress: { urn: 'urn:1234' } as Address,
      } as UserData;
      const user = UserMapper.fromData(userData);

      expect(user).toBeTruthy();
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.preferredInvoiceToAddressUrn).toBe(BasketMockData.getAddress().urn);
      expect(user.preferredShipToAddressUrn).toBe('urn:1234');
    });
  });
});

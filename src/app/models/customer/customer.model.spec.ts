import * as using from 'jasmine-data-provider';
import { CredentialsData } from '../credentials/credentials.interface';
import { CustomerFactory } from './customer.factory';
import { CustomerData } from './customer.interface';

describe('Customer', () => {
  describe('getDisplayName', () => {

    function dataProvider() {
      const customer1 = CustomerFactory.fromData({ credentials: { login: 'login' } as CredentialsData } as CustomerData);
      const customer2 = CustomerFactory.fromData({ firstName: 'Bob', credentials: { login: 'login' } as CredentialsData } as CustomerData);

      return [
        { customer: customer1, name: 'login' },
        { customer: customer2, name: 'Bob' },
      ];
    }

    using(dataProvider, (slice) => {
      it(`should return ${slice.name} when using '${JSON.stringify(slice.customer)}'`, () => {
        expect(slice.customer.getDisplayName()).toBe(slice.name);
      });
    });
  });
});

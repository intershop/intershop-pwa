import { FormControl, FormGroup } from '@angular/forms';
import { CustomerFactory } from './customer.factory';
import { CustomerData } from './customer.interface';

describe('Customer Factory', () => {
  describe('fromData', () => {
    it(`should return Customer when getting a RawCustomer`, () => {
      expect(CustomerFactory.fromData({ id: '1' } as CustomerData)).toBeTruthy();
    });
  });

  describe('fromForm', () => {
    const regForm = new FormGroup({
      birthday: new FormControl(''),
    });
    const addressForm = new FormGroup({
      countryCode: new FormControl('DE'),
      firstName: new FormControl('John'),
      lastName: new FormControl('Doe'),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      postalCode: new FormControl(''),
      phoneHome: new FormControl('1234567890'),
      city: new FormControl('')
    });

    regForm.addControl('address', addressForm);

    it(`should return Customer when getting a customer (registration) form`, () => {
      expect(CustomerFactory.fromForm(regForm)).toBeTruthy();
    });

    it(`should preset some fields on customer when getting a customer (registration) form with an address`, () => {
      const customer = CustomerFactory.fromForm(regForm);
      expect(customer.firstName).toEqual('John', 'First name is written to customer, if it is empty');
      expect(customer.lastName).toEqual('Doe', 'Last name is written to customer, if it is empty');
      expect(customer.phoneHome).toEqual('1234567890', 'Phone home is written to customer, if it is empty');
    });

    it(`should return null when getting no customer (registration) form`, () => {
      expect(CustomerFactory.fromForm(null)).toBeFalsy();
    });
  });
});


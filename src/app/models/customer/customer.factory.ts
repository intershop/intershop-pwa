import { AddressFactory } from '../address/address.factory';
import { CredentialsFactory } from '../credentials/credentials.factory';
import { FactoryHelper } from '../factory-helper';
import { CustomerData } from './customer.interface';
import { Customer } from './customer.model';


export class CustomerFactory {

  static fromData(data: CustomerData): Customer {
    const customer: Customer = new Customer();

    FactoryHelper.primitiveMapping<CustomerData, Customer>(data, customer);

    if (data.preferredShipToAddress) {
      customer.preferredShipToAddress = AddressFactory.fromData(data.preferredShipToAddress);
    }
    if (data.preferredInvoiceToAddress) {
      customer.preferredInvoiceToAddress = AddressFactory.fromData(data.preferredInvoiceToAddress);
    }
    customer.credentials = CredentialsFactory.fromData(data.credentials);
    return customer;
  }
}

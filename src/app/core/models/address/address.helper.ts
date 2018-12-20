import { Address } from './address.model';

export class AddressHelper {
  static equal(add1: Address, add2: Address): boolean {
    return !!add1 && !!add2 && add1.id === add2.id;
  }
}

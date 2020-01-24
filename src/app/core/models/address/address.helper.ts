import { Address } from './address.model';

export class AddressHelper {
  static equal(add1: Address, add2: Address): boolean {
    if (!add1 || !add2) {
      return false;
    }
    if (add1.urn && add2.urn) {
      return add1.urn === add2.urn;
    }
    // fallback to id if urn is not set
    return add1.id === add2.id;
  }
}

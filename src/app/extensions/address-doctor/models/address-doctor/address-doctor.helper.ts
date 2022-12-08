import { isEqual, pick } from 'lodash-es';

import { Address } from 'ish-core/models/address/address.model';

import { AddressDoctorMapper } from './address-doctor.mapper';

export class AddressDoctorHelper {
  static equalityCheck(address1: Address, address2: Address): boolean {
    if (!address1 || !address2) {
      return false;
    }

    const attributes = AddressDoctorMapper.attributes;
    return isEqual(pick(address1, ...attributes), pick(address2, ...attributes));
  }
}

import { Address } from 'ish-core/models/address/address.model';

import { AddressDoctorVariant } from './address-doctor.interface';

/**
 * Map incoming data from Address Doctor REST API to ICM compliant addresses.
 * The mapper is implemented and tested against German and British addresses.
 * The implementation with attributes needs to be adapted for other foreign addresses, when the overwrite does not match.
 *
 */
export class AddressDoctorMapper {
  static attributes = ['addressLine1', 'postalCode', 'city'];

  static fromData(variant: AddressDoctorVariant): Partial<Address> {
    return {
      addressLine1: `${variant.AddressElements.Street ? variant.AddressElements.Street[0].Value : ''} ${
        variant.AddressElements.HouseNumber ? variant.AddressElements.HouseNumber[0].Value : ''
      }`.trim(),
      postalCode: (variant.AddressElements.PostalCode ? variant.AddressElements.PostalCode[0].Value : '').trim(),
      city: variant.AddressElements.Locality.map(loc => loc.Value).join(' '),
    };
  }
}

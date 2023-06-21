export interface AddressDoctorVariants {
  Variants: AddressDoctorVariant[];
}

export interface AddressDoctorVariant {
  StatusValues: StatusValues;
  AddressElements: AddressElements;
  PreformattedData: PreformattedData;
}

interface StatusValues {
  AddressType: string;
  ResultGroup: string;
  LanguageISO3: string;
  UsedVerificationLevel: string;
  MatchPercentage: string;
  Script: string;
  AddressCount: string;
  ResultQuality: number;
}

interface AddressElements {
  Street: AddressElement[];
  HouseNumber: AddressElement[];
  Locality: AddressElement[];
  PostalCode: AddressElement[];
  AdministrativeDivision: AdministrativeDivision[];
  Country: Country[];
}

interface AddressElement {
  Value: string;
  SubItems: SubItems;
}

interface SubItems {
  Name?: string;
  // eslint-disable-next-line id-blacklist
  Number?: string;
  Base?: string;
}

interface AdministrativeDivision {
  Value: string;
  Variants: Variants;
}

interface Variants {
  Extended: string;
  ISO: string;
  Abbreviation: string;
}

interface Country {
  Code: string;
  Name: string;
}

interface PreformattedData {
  SingleAddressLine: PreformattedDataValue;
  PostalDeliveryAddressLines: PreformattedDataValue[];
  PostalFormattedAddressLines: PreformattedDataValue[];
  PostalLocalityLine: PreformattedDataValue;
}

interface PreformattedDataValue {
  Value: string;
}

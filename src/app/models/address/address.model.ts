import { Country } from '../country/country.model';

export class Address {
  urn: string;
  type?: string;
  addressName: string;
  companyName1?: string;
  companyName2?: string;
  title?: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  postalCode: string;
  city: string;
  mainDivision?: string;
  country: Country;
  phoneHome: string;

  constructor() { }
}

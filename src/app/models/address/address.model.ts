export interface Address {
  id: string;
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
  country: string;
  countryCode: string;
  phoneHome: string;
  email?: string;
  invoiceToAddress: boolean;
  shipToAddress: boolean;
}

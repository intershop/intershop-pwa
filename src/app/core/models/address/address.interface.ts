export interface AddressData {
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
  mainDivisionCode?: string;
  mainDivisionName?: string;
  country: string;
  countryCode: string;
  phoneHome: string;
  phoneMobile?: string;
  phoneBusiness?: string;
  phoneBusinessDirect?: string;
  fax?: string;
  email?: string;
  eligibleInvoiceToAddress: boolean;
  eligibleShipToAddress: boolean;
  eligibleShipFromAddress?: boolean;
  eligibleServiceToAddress?: boolean;
  eligibleInstallToAddress?: boolean;

  /* will be obsolete */
  invoiceToAddress: boolean;
  shipToAddress: boolean;
  shipFromAddress?: boolean;
  serviceToAddress?: boolean;
  installToAddress?: boolean;
  company?: string;
  street: string;
  street2?: string;
  street3?: string;
  state?: string;
  mobile?: string;
}

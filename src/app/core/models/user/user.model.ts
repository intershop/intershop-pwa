export interface User {
  title?: string;
  firstName: string;
  lastName: string;
  preferredLanguage?: string;
  birthday?: string;

  phoneHome?: string;
  phoneBusiness?: string;
  phoneMobile?: string;
  fax?: string;
  email: string;

  // necessary for registration form with loginType = 'username'
  login?: string;
  password?: string;

  preferredInvoiceToAddressUrn?: string;
  preferredShipToAddressUrn?: string;
  preferredPaymentInstrumentId?: string;

  // Business User only
  businessPartnerNo?: string;
  department?: string;
}

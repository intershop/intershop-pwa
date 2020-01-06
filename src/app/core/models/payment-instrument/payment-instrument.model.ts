/**
 * adjusted Payment method, e.g. a credit card or bank account
 */
export interface PaymentInstrument {
  id: string;
  urn?: string;
  accountIdentifier?: string;
  parameters?: {
    name: string;
    value: string;
  }[];
  paymentMethod?: string;
}

import { Attribute } from 'ish-core/models/attribute/attribute.model';

/**
 * adjusted Payment method, e.g. a credit card or bank account
 */
export interface PaymentInstrument {
  id: string;
  urn?: string;
  accountIdentifier?: string;
  parameters?: Attribute<string>[];
  paymentMethod?: string;
}

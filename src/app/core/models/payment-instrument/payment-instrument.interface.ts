import { Attribute } from 'ish-core/models/attribute/attribute.model';

/**
 * legacy interface - should get obsolete soon with a newer revision of the REST interface for account payment
 * parametrized payment method, e.g. a credit card or bank account
 */
export interface PaymentInstrumentData {
  id: string;
  name: string;
  attributes: Attribute<string>[];
  accountIdentifier: string;
}

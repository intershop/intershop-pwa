export type OrderIncludeType =
  | 'all'
  | 'buckets_discounts'
  | 'buckets_shippingMethod'
  | 'buckets_shipToAddress'
  | 'buckets'
  | 'buyingContext'
  | 'commonShippingMethod'
  | 'commonShipToAddress'
  | 'discounts_promotion'
  | 'discounts'
  | 'invoiceToAddress'
  | 'lineItems_discounts'
  | 'lineItems_product'
  | 'lineItems_shippingMethod'
  | 'lineItems_shipToAddress'
  | 'lineItems_warranty'
  | 'lineItems'
  | 'payments_paymentInstrument'
  | 'payments_paymentMethod'
  | 'payments'
  | 'withdrawal';

export interface OrderListQuery {
  limit: number;
  offset?: number;
  include?: OrderIncludeType[];
  documentNumber?: string[];
  customerOrderID?: string[];
  creationDateFrom?: string;
  creationDateTo?: string;
  lineItem_product?: string[];
  lineItem_customerProductID?: string[];
  lineItem_partialOrderNo?: string[];
  buyer?: string;
}

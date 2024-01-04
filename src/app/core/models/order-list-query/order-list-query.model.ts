export type OrderIncludeType =
  | 'all'
  | 'buckets'
  | 'buckets_discounts'
  | 'buckets_shipToAddress'
  | 'buckets_shippingMethod'
  | 'buyingContext'
  | 'commonShipToAddress'
  | 'commonShippingMethod'
  | 'discounts'
  | 'discounts_promotion'
  | 'invoiceToAddress'
  | 'lineItems'
  | 'lineItems_discounts'
  | 'lineItems_product'
  | 'lineItems_shipToAddress'
  | 'lineItems_shippingMethod'
  | 'lineItems_warranty'
  | 'payments'
  | 'payments_paymentInstrument'
  | 'payments_paymentMethod';

export interface OrderListQuery {
  limit: number;
  include?: OrderIncludeType[];
  offset?: number;
  statusCode?: (
    | 'NEW'
    | 'INPROGRESS'
    | 'CANCELLED'
    | 'CANCELLEDANDEXPORTED'
    | 'NOTDELIVERABLE'
    | 'DELIVERED'
    | 'RETURNED'
    | 'PENDING'
    | 'COMPLETED'
    | 'EXPORTED'
    | 'EXPORTFAILED'
    | 'MANUAL_INTERVENTION_NEEDED'
  )[];
  documentNumber?: string[];
  customerOrderID?: string[];
  creationDateFrom?: string;
  creationDateTo?: string;
  lineItem_product?: string[];
  lineItem_customerProductID?: string[];
  lineItem_partialOrderNo?: string[];
}

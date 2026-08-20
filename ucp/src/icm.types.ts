/**
 * Minimal, defensively-typed views of the ICM REST payloads this service reads.
 *
 * ICM response shapes vary across versions (7.10 / 11 / 12+), so every field is
 * optional and mappers must degrade gracefully. These interfaces intentionally
 * only capture the fields the UCP catalog mapping actually uses.
 */

export interface IcmMoney {
  value?: number;
  currency?: string;
  currencyMnemonic?: string;
  gross?: IcmMoney;
  net?: IcmMoney;
}

export interface IcmImage {
  effectiveUrl?: string;
  primaryImage?: boolean;
}

export interface IcmProductData {
  sku?: string;
  /** Present on search-result link stubs, e.g. `.../products/849899`. */
  uri?: string;
  /** Present on search-result link stubs (product display name). */
  title?: string;
  productName?: string;
  shortDescription?: string;
  longDescription?: string;
  listPrice?: IcmMoney;
  salePrice?: IcmMoney;
  availability?: boolean;
  inStock?: boolean;
  manufacturer?: string;
  images?: IcmImage[];
}

/** `GET products/{sku}` returns the product directly (no envelope). */
export type IcmProductResponse = IcmProductData;

/** `GET products?searchTerm=...` returns an `elements` envelope of stubs/links. */
export interface IcmProductSearchResponse {
  elements?: IcmProductData[];
  total?: number;
}

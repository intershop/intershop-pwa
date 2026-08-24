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
  /** Range bounds present on variation masters (`VARIATION_MASTER`) and retail sets. */
  minListPrice?: IcmMoney;
  maxListPrice?: IcmMoney;
  minSalePrice?: IcmMoney;
  maxSalePrice?: IcmMoney;
  /** Retail-set totals: the sum of all set parts. */
  summedUpListPrice?: IcmMoney;
  summedUpSalePrice?: IcmMoney;
  /** `true` for retail sets; parts are summed for the upper price bound. */
  retailSet?: boolean;
  /** `true` for variation masters; variations span the min/max price bounds. */
  productMaster?: boolean;
  /** `true` on a variation product (a child of a variation master). */
  mastered?: boolean;
  /** On a variation product, the SKU of its variation master. */
  productMasterSKU?: string;
  /** e.g. `['RETAIL_SET']`, `['VARIATION_MASTER']`, `['VARIATION_PRODUCT']`. */
  productTypes?: string[];
  availability?: boolean;
  inStock?: boolean;
  manufacturer?: string;
  images?: IcmImage[];
}

/** A single variation-defining attribute value on a variation, e.g. `Hard drive size = 256GB`. */
export interface IcmVariationAttributeValue {
  name?: string;
  value?: string;
  variationAttributeId?: string;
}

/** One entry of a master's `variations` list: a link plus the values that define it. */
export interface IcmVariationLink {
  uri?: string;
  attributes?: { name?: string; value?: unknown }[];
  variableVariationAttributeValues?: IcmVariationAttributeValue[];
}

/** `GET products/{master}/variations` returns an `elements` envelope of variation links. */
export interface IcmVariationsResponse {
  elements?: IcmVariationLink[];
}

/** `GET products/{sku}` returns the product directly (no envelope). */
export type IcmProductResponse = IcmProductData;

/** `GET products?searchTerm=...` returns an `elements` envelope of stubs/links. */
export interface IcmProductSearchResponse {
  elements?: IcmProductData[];
  total?: number;
}

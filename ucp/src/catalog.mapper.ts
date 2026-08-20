import { IcmMoney, IcmProductData } from './icm.types';

/**
 * Maps ICM products to the UCP Catalog `Product`/`Variant` model, per
 * https://ucp.dev/specification/catalog/ .
 *
 * A UCP Product groups one or more purchasable Variants. ICM products are
 * modelled here as single-variant products where variant.id === product.id === SKU.
 */

/** Currencies whose ISO 4217 minor unit is not 2 digits (extend as needed). */
const CURRENCY_MINOR_UNITS: Record<string, number> = {
  JPY: 0,
  KRW: 0,
  CLP: 0,
  BHD: 3,
  KWD: 3,
  TND: 3,
};

function minorUnitDigits(currency: string): number {
  return CURRENCY_MINOR_UNITS[currency.toUpperCase()] ?? 2;
}

/** UCP Price — integer amount in the currency's minor units + ISO 4217 currency. */
export interface UcpPrice {
  amount: number;
  currency: string;
}

export interface UcpPriceRange {
  min: UcpPrice;
  max: UcpPrice;
}

export interface UcpMedia {
  type: 'image';
  url: string;
  alt_text?: string;
}

/** Correlation entry for lookup responses (which request id resolved to this variant). */
export interface UcpVariantInput {
  id: string;
  match: 'exact' | 'featured';
}

export interface UcpVariant {
  id: string;
  sku?: string;
  title: string;
  description: { plain: string };
  url?: string;
  price: UcpPrice;
  list_price?: UcpPrice;
  availability: { available: boolean };
  media: UcpMedia[];
  inputs?: UcpVariantInput[];
}

export interface UcpProduct {
  id: string;
  title: string;
  description: { plain: string };
  url?: string;
  price_range: UcpPriceRange;
  list_price_range?: UcpPriceRange;
  media: UcpMedia[];
  variants: UcpVariant[];
  tags?: string[];
}

export interface ToUcpProductContext {
  /** ISO 4217 currency used as fallback when ICM omits it. */
  currency: string;
  /** Absolute origin of the ICM backend, to resolve relative image URLs. */
  icmBaseUrl: string;
  /** Absolute origin of the storefront, to build product page URLs. */
  storefrontBaseUrl: string;
  /** When set, adds a lookup correlation `inputs` entry to the variant. */
  input?: UcpVariantInput;
}

/**
 * Extract a normalized minor-unit amount from an ICM `Money` object, tolerating
 * the several shapes ICM uses across versions.
 */
function fromIcmMoney(money: IcmMoney | undefined, fallbackCurrency: string): UcpPrice | undefined {
  if (!money) {
    return undefined;
  }
  const source = money.gross ?? money;
  const value = source.value ?? money.value;
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return undefined;
  }
  const currency = source.currency ?? money.currency ?? money.currencyMnemonic ?? fallbackCurrency;
  const factor = 10 ** minorUnitDigits(currency);
  return { amount: Math.round(value * factor), currency: currency.toUpperCase() };
}

function absoluteImageUrl(url: string, icmBaseUrl: string): string {
  return url.startsWith('http') ? url : `${icmBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

function pickMedia(product: IcmProductData, context: ToUcpProductContext): UcpMedia[] {
  const images = product.images ?? [];
  const primary = images.filter(image => image.primaryImage && image.effectiveUrl);
  const chosen = primary.length ? primary : images.filter(image => image.effectiveUrl);
  return chosen.map(image => ({
    type: 'image' as const,
    url: absoluteImageUrl(image.effectiveUrl as string, context.icmBaseUrl),
    alt_text: product.productName,
  }));
}

interface UcpPricing {
  price: UcpPrice;
  list_price?: UcpPrice;
  price_range: UcpPriceRange;
  list_price_range?: UcpPriceRange;
}

/** Derive the UCP price and optional strike-through list price from an ICM product. */
function computePricing(product: IcmProductData, currency: string): UcpPricing {
  const sale = fromIcmMoney(product.salePrice, currency);
  const list = fromIcmMoney(product.listPrice, currency);
  const price: UcpPrice = sale ?? list ?? { amount: 0, currency };
  const hasStrikethrough = !!(list && sale && list.amount !== sale.amount);
  return {
    price,
    price_range: { min: price, max: price },
    ...(hasStrikethrough && list ? { list_price: list, list_price_range: { min: list, max: list } } : {}),
  };
}

/** Map an ICM product to a single-variant UCP Catalog Product. */
export function toUcpProduct(product: IcmProductData, context: ToUcpProductContext): UcpProduct {
  const sku = product.sku ?? '';
  const pricing = computePricing(product, context.currency);
  const media = pickMedia(product, context);
  const title = product.productName ?? sku;
  const description = { plain: product.shortDescription ?? product.longDescription ?? product.productName ?? sku };
  const url = `${context.storefrontBaseUrl}/product/${encodeURIComponent(sku)}`;
  const available = product.inStock ?? product.availability ?? false;

  const variant: UcpVariant = {
    id: sku,
    sku,
    title,
    description,
    url,
    price: pricing.price,
    ...(pricing.list_price ? { list_price: pricing.list_price } : {}),
    availability: { available },
    media,
    ...(context.input ? { inputs: [context.input] } : {}),
  };

  return {
    id: sku,
    title,
    description,
    url,
    price_range: pricing.price_range,
    ...(pricing.list_price_range ? { list_price_range: pricing.list_price_range } : {}),
    media,
    variants: [variant],
    ...(product.manufacturer ? { tags: [product.manufacturer] } : {}),
  };
}

import { IcmImage, IcmMoney, IcmProductData, IcmVariationAttributeValue } from '../icm/icm.types';

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

/** A value the buyer selects for a variant, e.g. `Size: 10`. */
export interface UcpSelectedOption {
  name: string;
  label: string;
}

/** A product-level option dimension with its distinct values, e.g. `Size: [8, 9, 10]`. */
export interface UcpProductOption {
  name: string;
  /** `exists`/`available` are populated only for the `get_product` detail response. */
  values: { label: string; exists?: boolean; available?: boolean }[];
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
  options?: UcpSelectedOption[];
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
  options?: UcpProductOption[];
  /** Effective option selection anchoring the featured variant (get_product detail only). */
  selected?: UcpSelectedOption[];
  variants: UcpVariant[];
  tags?: string[];
}

export interface ToUcpProductContext {
  /** ISO 4217 currency used as fallback when ICM omits it. */
  currency: string;
  /** ICM `loc` value the catalog is served in; forwarded to ICM calls. */
  locale?: string;
  /** Absolute origin of the ICM backend, to resolve relative image URLs. */
  icmBaseUrl: string;
  /** Absolute origin of the storefront, to build product page URLs. */
  storefrontBaseUrl: string;
  /** When set, adds a lookup correlation `inputs` entry to the variant. */
  input?: UcpVariantInput;
  /** `get_product` detail mode: emit `selected` and option `available`/`exists` signals. */
  detail?: boolean;
  /** `get_product` interactive narrowing: option selections that anchor the featured variant. */
  selected?: UcpSelectedOption[];
  /** `get_product` option relaxation priority (lowest-priority names relaxed first). */
  preferences?: string[];
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

// Prefer a reasonably sized representative per view; larger comes later so a bigger tier wins ties.
const IMAGE_SIZE_RANK: Record<string, number> = { L: 4, ZOOM: 3, M: 2, S: 1 };

function pickMedia(product: IcmProductData, context: ToUcpProductContext): UcpMedia[] {
  const images = (product.images ?? []).filter(image => image.effectiveUrl);
  // Collapse the per-size variants (S/M/L/ZOOM) of each view down to a single best image.
  const bestPerView = new Map<string, { image: IcmImage; rank: number }>();
  for (const image of images) {
    const view = image.viewID ?? (image.effectiveUrl as string);
    const rank = IMAGE_SIZE_RANK[(image.typeID ?? '').toUpperCase()] ?? 0;
    const current = bestPerView.get(view);
    if (!current || rank > current.rank) {
      bestPerView.set(view, { image, rank });
    }
  }
  // Featured (primary) views first so media[0] is the main product shot.
  const ordered = [...bestPerView.values()].sort(
    (a, b) => Number(b.image.primaryImage ?? false) - Number(a.image.primaryImage ?? false)
  );
  return ordered.map(({ image }) => ({
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

type IcmProductKind = 'set' | 'master' | 'simple';

/** Classify the ICM product so pricing can pick the right range fields. */
function productKind(product: IcmProductData): IcmProductKind {
  if (product.retailSet === true || product.productTypes?.includes('RETAIL_SET')) {
    return 'set';
  }
  if (product.productMaster === true || product.productTypes?.includes('VARIATION_MASTER')) {
    return 'master';
  }
  return 'simple';
}

/** The four ICM money fields for one price tier (sale or list). */
interface IcmPriceTier {
  single?: IcmMoney;
  min?: IcmMoney;
  max?: IcmMoney;
  summedUp?: IcmMoney;
}

/**
 * Resolve one price tier into a UCP range plus a single representative price.
 *  - simple  products carry a single `{tier}Price`
 *  - masters span `min{Tier}Price` .. `max{Tier}Price` across variations
 *  - retail sets span `min{Tier}Price` (cheapest part) .. `summedUp{Tier}Price` (whole set)
 *
 * The representative price is what a single UCP variant advertises: the whole-set
 * total for sets, the "from" price for masters, the plain price otherwise.
 */
function resolveTier(
  kind: IcmProductKind,
  tier: IcmPriceTier,
  currency: string
): { range?: UcpPriceRange; representative?: UcpPrice } {
  const single = fromIcmMoney(tier.single, currency);
  const min = fromIcmMoney(tier.min, currency) ?? single;
  const upper =
    kind === 'set'
      ? fromIcmMoney(tier.summedUp, currency)
      : kind === 'master'
        ? fromIcmMoney(tier.max, currency)
        : single;
  const max = upper ?? min;
  const range = min && max ? { min, max } : undefined;
  const representative =
    kind === 'set' ? (fromIcmMoney(tier.summedUp, currency) ?? single) : kind === 'master' ? min : single;
  return { range, representative };
}

/** Derive the UCP price range and optional strike-through list price from an ICM product. */
function computePricing(product: IcmProductData, currency: string): UcpPricing {
  const kind = productKind(product);
  const sale = resolveTier(
    kind,
    {
      single: product.salePrice,
      min: product.minSalePrice,
      max: product.maxSalePrice,
      summedUp: product.summedUpSalePrice,
    },
    currency
  );
  const list = resolveTier(
    kind,
    {
      single: product.listPrice,
      min: product.minListPrice,
      max: product.maxListPrice,
      summedUp: product.summedUpListPrice,
    },
    currency
  );

  const price: UcpPrice = sale.representative ?? list.representative ?? { amount: 0, currency };
  const price_range = sale.range ?? list.range ?? { min: price, max: price };

  // Strike-through only when the list price is genuinely higher than the sale price.
  const hasStrikethrough = !!(
    list.representative &&
    sale.representative &&
    list.representative.amount > sale.representative.amount
  );
  return {
    price,
    price_range,
    ...(hasStrikethrough && list.representative ? { list_price: list.representative } : {}),
    ...(hasStrikethrough && list.range ? { list_price_range: list.range } : {}),
  };
}

/** Map an ICM product to a single-variant UCP Catalog Product. */
export function toUcpProduct(product: IcmProductData, context: ToUcpProductContext): UcpProduct {
  const sku = product.sku ?? '';
  const pricing = computePricing(product, context.currency);
  const media = pickMedia(product, context);
  const title = product.productName ?? sku;
  const description = { plain: product.shortDescription ?? product.longDescription ?? product.productName ?? sku };
  // PWA canonical short product route; the storefront redirects to the locale-prefixed URL.
  const url = `${context.storefrontBaseUrl}/prd${encodeURIComponent(sku)}`;
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

/** One variation of a master: the full variation product plus its defining attribute values. */
export interface IcmVariation {
  product: IcmProductData;
  attributeValues: IcmVariationAttributeValue[];
  /** ICM `defaultVariation` flag; the default is featured first per the UCP catalog spec. */
  isDefault?: boolean;
}

/** Map the variation-defining attribute values into UCP selected options (e.g. `Size: 10`). */
function toSelectedOptions(attributeValues: IcmVariationAttributeValue[]): UcpSelectedOption[] {
  return attributeValues
    .filter(attr => attr.value != null)
    .map(attr => ({ name: attr.name ?? attr.variationAttributeId ?? '', label: String(attr.value) }));
}

/** Map a single ICM variation product to a UCP variant. */
function toUcpVariant(variation: IcmVariation, context: ToUcpProductContext): UcpVariant {
  const { product, attributeValues } = variation;
  const sku = product.sku ?? '';
  const pricing = computePricing(product, context.currency);
  const options = toSelectedOptions(attributeValues);
  const title = options.length ? options.map(option => option.label).join(', ') : (product.productName ?? sku);
  const available = product.inStock ?? product.availability ?? false;

  return {
    id: sku,
    sku,
    title,
    description: { plain: product.shortDescription ?? product.productName ?? sku },
    url: `${context.storefrontBaseUrl}/prd${encodeURIComponent(sku)}`,
    price: pricing.price,
    ...(pricing.list_price ? { list_price: pricing.list_price } : {}),
    availability: { available },
    media: pickMedia(product, context),
    ...(options.length ? { options } : {}),
  };
}

/** Aggregate the distinct option dimensions and values across all variations, preserving order. */
function aggregateOptions(variations: IcmVariation[]): UcpProductOption[] {
  const order: string[] = [];
  const byKey = new Map<string, { name: string; values: string[] }>();
  for (const variation of variations) {
    for (const attr of variation.attributeValues ?? []) {
      if (attr.value == null) {
        continue;
      }
      const key = attr.variationAttributeId ?? attr.name ?? '';
      const value = String(attr.value);
      let entry = byKey.get(key);
      if (!entry) {
        entry = { name: attr.name ?? attr.variationAttributeId ?? '', values: [] };
        byKey.set(key, entry);
        order.push(key);
      }
      if (!entry.values.includes(value)) {
        entry.values.push(value);
      }
    }
  }
  return order.map(key => {
    const entry = byKey.get(key) as { name: string; values: string[] };
    return { name: entry.name, values: entry.values.map(label => ({ label })) };
  });
}

/**
 * Adds the `get_product` availability signals per value, evaluated relative to the featured
 * variant's selection: for each option dimension the other dimensions are held to the featured
 * value, then `exists`/`available` reflect whether a (in-stock) variation carries that value.
 */
function detailOptionsRelative(variations: IcmVariation[], featured: IcmVariation | undefined): UcpProductOption[] {
  const dims: { key: string; name: string }[] = [];
  const seen = new Set<string>();
  for (const variation of variations) {
    for (const attr of variation.attributeValues ?? []) {
      if (attr.value == null) {
        continue;
      }
      const key = attr.variationAttributeId ?? attr.name ?? '';
      if (!seen.has(key)) {
        seen.add(key);
        dims.push({ key, name: attr.name ?? key });
      }
    }
  }
  const labelOf = (variation: IcmVariation, key: string): string | undefined => {
    const attr = variation.attributeValues?.find(a => (a.variationAttributeId ?? a.name) === key);
    return attr?.value != null ? String(attr.value) : undefined;
  };
  const featuredSelection = new Map<string, string | undefined>();
  dims.forEach(dim => featuredSelection.set(dim.key, featured ? labelOf(featured, dim.key) : undefined));

  return dims.map(dim => {
    const values: string[] = [];
    for (const variation of variations) {
      const label = labelOf(variation, dim.key);
      if (label != null && !values.includes(label)) {
        values.push(label);
      }
    }
    return {
      name: dim.name,
      values: values.map(label => {
        const match = variations.find(
          variation =>
            labelOf(variation, dim.key) === label &&
            dims.every(
              other => other.key === dim.key || labelOf(variation, other.key) === featuredSelection.get(other.key)
            )
        );
        const available = match ? (match.product.inStock ?? match.product.availability ?? false) : false;
        return { label, exists: !!match, available };
      }),
    };
  });
}

/**
 * Resolve the featured variation for a `get_product` selection: find a variation matching all
 * `selected` options, relaxing the lowest-priority option first (names later in `preferences`,
 * or absent from it, are relaxed before earlier ones). Returns undefined if nothing matches.
 */
function narrowVariation(
  variations: IcmVariation[],
  selected: UcpSelectedOption[],
  preferences: string[]
): IcmVariation | undefined {
  const labelOf = (variation: IcmVariation, name: string): string | undefined => {
    const attr = variation.attributeValues?.find(a => (a.name ?? a.variationAttributeId) === name);
    return attr?.value != null ? String(attr.value) : undefined;
  };
  const matchesAll = (variation: IcmVariation, constraints: UcpSelectedOption[]): boolean =>
    constraints.every(sel => labelOf(variation, sel.name) === sel.label);
  const rank = (name: string): number => {
    const index = preferences.indexOf(name);
    return index === -1 ? -1 : preferences.length - index;
  };

  let constraints = [...selected];
  while (constraints.length) {
    const found = variations.find(variation => matchesAll(variation, constraints));
    if (found) {
      return found;
    }
    let dropIndex = 0;
    for (let i = 1; i < constraints.length; i++) {
      if (rank(constraints[i].name) < rank(constraints[dropIndex].name)) {
        dropIndex = i;
      }
    }
    constraints = constraints.filter((_, i) => i !== dropIndex);
  }
  return undefined;
}

/**
 * Map an ICM variation master plus its resolved variations to a full UCP Product:
 * one variant per variation with its selected options, product-level `options`, and a
 * `price_range` spanning all variants. The ICM default variation is featured first
 * (`variants[0]`) per the UCP catalog spec. When a lookup id is provided, the matching
 * variant is correlated via `inputs` (exact for a variation SKU, otherwise featured).
 */
export function toUcpMasterProduct(
  master: IcmProductData,
  variations: IcmVariation[],
  context: ToUcpProductContext
): UcpProduct {
  const masterSku = master.sku ?? '';
  const pricing = computePricing(master, context.currency);
  const title = master.productName ?? masterSku;
  const description = { plain: master.shortDescription ?? master.longDescription ?? master.productName ?? masterSku };
  // Featured variant: for a get_product selection, narrow to it (relaxing per preferences);
  // otherwise the ICM default variation. Option value order stays natural (original order).
  const defaultVariation = variations.find(variation => variation.isDefault) ?? variations[0];
  const narrowed =
    context.detail && context.selected?.length
      ? narrowVariation(variations, context.selected, context.preferences ?? [])
      : undefined;
  const featured = narrowed ?? defaultVariation;
  const featuredFirst = featured ? [featured, ...variations.filter(variation => variation !== featured)] : variations;
  const variants = featuredFirst.map(variation => toUcpVariant(variation, context));
  const options = context.detail ? detailOptionsRelative(variations, featured) : aggregateOptions(variations);
  // get_product detail anchors the featured variant with an explicit `selected` selection.
  const selected = context.detail && featured ? toSelectedOptions(featured.attributeValues) : [];

  if (context.input && variants.length) {
    const exact = variants.find(variant => variant.sku === context.input?.id);
    const target = exact ?? variants[0];
    target.inputs = [{ id: context.input.id, match: exact ? 'exact' : 'featured' }];
  }

  return {
    id: masterSku,
    title,
    description,
    url: `${context.storefrontBaseUrl}/prd${encodeURIComponent(masterSku)}`,
    price_range: pricing.price_range,
    ...(pricing.list_price_range ? { list_price_range: pricing.list_price_range } : {}),
    media: pickMedia(master, context),
    ...(options.length ? { options } : {}),
    ...(selected.length ? { selected } : {}),
    variants,
    ...(master.manufacturer ? { tags: [master.manufacturer] } : {}),
  };
}

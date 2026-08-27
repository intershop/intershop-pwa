import { config as loadDotenv } from 'dotenv';

loadDotenv();

/** UCP spec/profile version advertised by this business. */
export const UCP_VERSION = '2026-04-08';

/** Base path under which the UCP catalog capability is served. */
export const UCP_BASE_PATH = '/ucp/v1';

/** Default number of products returned by catalog search (UCP conformance default). */
export const CATALOG_DEFAULT_LIMIT = 10;

/** Maximum number of products returned by catalog search in a single page. */
export const CATALOG_MAX_LIMIT = 50;

/** Maximum number of identifiers accepted in a single catalog lookup batch. */
export const CATALOG_MAX_LOOKUP_IDS = 100;

/** Number of lookup ids resolved against ICM in parallel (bounds fan-out latency vs. load). */
export const CATALOG_LOOKUP_CONCURRENCY = 6;

/** Resolved, plain configuration the service depends on. */
export interface UcpConfig {
  /** Port the service listens on. */
  port: number;
  /** Optional fixed public origin used in the profile; falls back to the request origin. */
  publicBaseUrl?: string;
  /** Storefront origin used to build product page URLs; falls back to the request origin. */
  storefrontBaseUrl?: string;
  icmBaseUrl: string;
  icmServer: string;
  icmChannel: string;
  icmApplication: string;
  locale: string;
  currency: string;
  /** Locales the catalog can be served in (ICM `loc` values); the first is the default. */
  supportedLocales: string[];
  /** Currencies the catalog can be served in (ISO 4217); the first is the default. */
  supportedCurrencies: string[];
  /** Optional host-to-channel markets; when set, the channel is resolved per request from the `Host`. */
  markets: MarketConfig[];
}

/**
 * A single market in the optional `UCP_MARKETS` map: one `Host` (or several) bound to an ICM
 * channel, with optional locale/currency, advertised sets, and origin overrides. Lets one UCP
 * instance serve several channels/origins (see `resolveMarket`).
 */
export interface MarketConfig {
  /** Request `Host` header(s) that select this market (case-insensitive, port ignored). */
  host: string | string[];
  /** ICM channel served for this host. */
  icmChannel: string;
  /** Default ICM `loc` value; falls back to the global `ICM_LOCALE`. */
  locale?: string;
  /** Default ISO 4217 currency; falls back to the global `ICM_CURRENCY`. */
  currency?: string;
  /** Locales advertised for this host; falls back to the global supported set. */
  supportedLocales?: string[];
  /** Currencies advertised for this host; falls back to the global supported set. */
  supportedCurrencies?: string[];
  /** Storefront origin for product links on this host; falls back to the global `STOREFRONT_BASE_URL`. */
  storefrontBaseUrl?: string;
  /** Public origin advertised in this host's profile; falls back to the global `UCP_PUBLIC_BASE_URL`. */
  publicBaseUrl?: string;
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

/** De-duplicate `entries` case-insensitively, always keeping `fallback` first. */
function dedupeList(entries: string[], fallback: string): string[] {
  const seen = new Map<string, string>();
  for (const entry of [fallback, ...entries]) {
    const trimmed = entry?.trim();
    if (trimmed && !seen.has(trimmed.toLowerCase())) {
      seen.set(trimmed.toLowerCase(), trimmed);
    }
  }
  return [...seen.values()];
}

/** Parse a comma-separated env list, always including `fallback` first and de-duplicating case-insensitively. */
function parseList(value: string | undefined, fallback: string): string[] {
  return dedupeList((value ?? '').split(','), fallback);
}

/** Parse the optional `UCP_MARKETS` JSON array; empty when unset (single-channel default). */
function parseMarkets(value: string | undefined): MarketConfig[] {
  if (!value?.trim()) {
    return [];
  }
  let raw: unknown;
  try {
    raw = JSON.parse(value);
  } catch {
    throw new Error('UCP_MARKETS must be valid JSON.');
  }
  if (!Array.isArray(raw)) {
    throw new Error('UCP_MARKETS must be a JSON array.');
  }
  return raw.map((entry, index) => {
    const market = entry as Partial<MarketConfig>;
    if (!market.host || !market.icmChannel) {
      throw new Error(`UCP_MARKETS[${index}] requires "host" and "icmChannel".`);
    }
    return market as MarketConfig;
  });
}

function hostsOf(market: MarketConfig): string[] {
  return Array.isArray(market.host) ? market.host : [market.host];
}

/**
 * Resolve the effective per-request configuration for the requested `Host`.
 *
 * With no `UCP_MARKETS` configured (or no host match) this returns the global config unchanged —
 * i.e. today's single-channel behavior. When a market matches, its channel and overrides win, so
 * one instance can serve several channels/origins keyed on `Host` (UCP is origin-scoped).
 */
export function resolveMarket(config: UcpConfig, host: string | undefined): UcpConfig {
  if (!config.markets.length || !host) {
    return config;
  }
  const hostname = host.split(':')[0].toLowerCase();
  const market = config.markets.find(entry => hostsOf(entry).some(h => h.toLowerCase() === hostname));
  if (!market) {
    return config;
  }
  const locale = market.locale ?? config.locale;
  const currency = market.currency ?? config.currency;
  return {
    ...config,
    icmChannel: market.icmChannel,
    locale,
    currency,
    supportedLocales: dedupeList(market.supportedLocales ?? config.supportedLocales, locale),
    supportedCurrencies: dedupeList(market.supportedCurrencies ?? config.supportedCurrencies, currency),
    storefrontBaseUrl: market.storefrontBaseUrl
      ? stripTrailingSlash(market.storefrontBaseUrl)
      : config.storefrontBaseUrl,
    publicBaseUrl: market.publicBaseUrl ? stripTrailingSlash(market.publicBaseUrl) : config.publicBaseUrl,
  };
}

/** Resolve the UCP configuration from environment variables. */
export function resolveUcpConfig(): UcpConfig {
  const locale = process.env.ICM_LOCALE ?? 'en_US';
  const currency = process.env.ICM_CURRENCY ?? 'USD';
  return {
    port: Number(process.env.UCP_PORT ?? 4000),
    publicBaseUrl: process.env.UCP_PUBLIC_BASE_URL ? stripTrailingSlash(process.env.UCP_PUBLIC_BASE_URL) : undefined,
    storefrontBaseUrl: process.env.STOREFRONT_BASE_URL
      ? stripTrailingSlash(process.env.STOREFRONT_BASE_URL)
      : undefined,
    icmBaseUrl: stripTrailingSlash(process.env.ICM_BASE_URL ?? 'https://develop.icm.intershop.de'),
    icmServer: process.env.ICM_SERVER ?? 'INTERSHOP/rest/WFS',
    icmChannel: process.env.ICM_CHANNEL ?? 'inSPIRED-inTRONICS_Business-Site',
    icmApplication: process.env.ICM_APPLICATION ?? '-',
    locale,
    currency,
    supportedLocales: parseList(process.env.ICM_SUPPORTED_LOCALES, locale),
    supportedCurrencies: parseList(process.env.ICM_SUPPORTED_CURRENCIES, currency),
    markets: parseMarkets(process.env.UCP_MARKETS),
  };
}

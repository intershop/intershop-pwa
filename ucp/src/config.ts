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
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

/** Parse a comma-separated env list, always including `fallback` first and de-duplicating case-insensitively. */
function parseList(value: string | undefined, fallback: string): string[] {
  const items = (value ?? '').split(',').map(entry => entry.trim());
  const seen = new Map<string, string>();
  for (const entry of [fallback, ...items]) {
    if (entry && !seen.has(entry.toLowerCase())) {
      seen.set(entry.toLowerCase(), entry);
    }
  }
  return [...seen.values()];
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
  };
}

import { UcpConfig } from '../config';

/**
 * Per-request locale/currency negotiation for the catalog capability.
 *
 * The catalog data is served in whatever locale/currency the ICM channel is
 * configured for, but an agent may request another from the advertised sets
 * (`supported_locales` / `supported_currencies` in the profile). Language is
 * negotiated via the standard `Accept-Language` header, currency via a parallel
 * `Accept-Currency` header. Anything unsupported falls back to the defaults.
 */
export interface NegotiatedLocale {
  /** ICM `loc` value, e.g. `en_US`. */
  locale: string;
  /** ISO 4217 currency, e.g. `USD`. */
  currency: string;
}

/** Parse an `Accept-Language` header into tags ordered by descending q-value. */
function parseAcceptLanguage(header: string | undefined): string[] {
  if (!header) {
    return [];
  }
  return header
    .split(',')
    .map(part => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.map(param => param.trim()).find(param => param.startsWith('q='));
      const weight = q ? Number(q.slice(2)) : 1;
      return { tag: tag.trim(), weight: Number.isFinite(weight) ? weight : 0 };
    })
    .filter(entry => entry.tag && entry.tag !== '*' && entry.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .map(entry => entry.tag);
}

/** Best supported ICM locale for an `Accept-Language` header, or the configured default. */
export function negotiateLocale(header: string | undefined, config: UcpConfig): string {
  const supported = config.supportedLocales;
  for (const tag of parseAcceptLanguage(header)) {
    const normalized = tag.replace('-', '_').toLowerCase();
    const exact = supported.find(locale => locale.toLowerCase() === normalized);
    if (exact) {
      return exact;
    }
    const language = normalized.split('_')[0];
    const byLanguage = supported.find(locale => locale.toLowerCase().split('_')[0] === language);
    if (byLanguage) {
      return byLanguage;
    }
  }
  return config.locale;
}

/** Best supported currency for an `Accept-Currency` header, or the configured default. */
export function negotiateCurrency(header: string | undefined, config: UcpConfig): string {
  const wanted = (header ?? '')
    .split(',')
    .map(entry => entry.trim().toUpperCase())
    .filter(Boolean);
  for (const code of wanted) {
    const match = config.supportedCurrencies.find(currency => currency.toUpperCase() === code);
    if (match) {
      return match;
    }
  }
  return config.currency;
}

/** Resolve the negotiated locale/currency from a request's `Accept-*` headers. */
export function negotiate(
  headers: { acceptLanguage?: string; acceptCurrency?: string },
  config: UcpConfig
): NegotiatedLocale {
  return {
    locale: negotiateLocale(headers.acceptLanguage, config),
    currency: negotiateCurrency(headers.acceptCurrency, config),
  };
}

/** Render an ICM locale (`en_US`) as a BCP-47 `Content-Language` value (`en-US`). */
export function toContentLanguage(locale: string): string {
  return locale.replace('_', '-');
}

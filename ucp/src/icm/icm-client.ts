import { UcpConfig } from '../config';
import { getLogger } from '../logger';

import { IcmError } from './icm.error';
import { IcmProductResponse, IcmProductSearchResponse, IcmVariationsResponse } from './icm.types';

const logger = getLogger('UCP');

/** Optional per-request locale/currency override for a single ICM call. */
export interface IcmRequestLocale {
  locale?: string;
  currency?: string;
}

/**
 * Thin, read-only REST client for the Intershop ICM commerce API.
 *
 * URL construction mirrors the PWA `ApiService`:
 *   {icmBaseUrl}/{icmServer}/{icmChannel}/{icmApplication};loc=..;cur=../{path}
 *
 * Scope: product discovery (Search and Lookup) only. Transactional basket and
 * order operations are intentionally not implemented.
 */
export class IcmCatalogClient {
  private readonly baseEndpoint: string;

  constructor(private readonly config: UcpConfig) {
    const { icmBaseUrl, icmServer, icmChannel, icmApplication } = config;
    this.baseEndpoint = [icmBaseUrl, icmServer, icmChannel, icmApplication].filter(Boolean).join('/');
  }

  private buildUrl(
    path: string,
    query?: Record<string, boolean | number | string | undefined>,
    locale?: IcmRequestLocale
  ): string {
    const loc = locale?.locale ?? this.config.locale;
    const cur = locale?.currency ?? this.config.currency;
    const matrix = `;loc=${loc};cur=${cur}`;
    const url = new URL(`${this.baseEndpoint}${matrix}/${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async request<T>(
    path: string,
    query?: Record<string, boolean | number | string | undefined>,
    locale?: IcmRequestLocale
  ): Promise<T> {
    const url = this.buildUrl(path, query, locale);
    const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
    const text = await response.text();
    const parsed: unknown = text ? safeJsonParse(text) : undefined;

    if (!response.ok) {
      logger.warn({ http: { response: { status_code: response.status } }, url: { full: url } }, 'ICM request failed');
      throw new IcmError(`ICM GET ${path} failed with ${response.status}`, response.status, parsed ?? text);
    }
    return parsed as T;
  }

  /** Look up a single product by SKU. */
  getProduct(sku: string, locale?: IcmRequestLocale): Promise<IcmProductResponse> {
    return this.request<IcmProductResponse>(
      `products/${encodeURIComponent(sku)}`,
      { allImages: true, extended: true },
      locale
    );
  }

  /** Free-text product search returning link stubs (SKUs resolved separately). */
  searchProducts(
    searchTerm: string,
    amount: number,
    offset = 0,
    locale?: IcmRequestLocale
  ): Promise<IcmProductSearchResponse> {
    return this.request<IcmProductSearchResponse>(
      'products',
      {
        searchTerm,
        amount,
        offset,
        attrs: 'sku,productName,shortDescription,listPrice,salePrice,availability,inStock',
      },
      locale
    );
  }

  /** List the variations of a variation master (links + their defining attribute values). */
  getVariations(masterSku: string, locale?: IcmRequestLocale): Promise<IcmVariationsResponse> {
    return this.request<IcmVariationsResponse>(
      `products/${encodeURIComponent(masterSku)}/variations`,
      { amount: 50 },
      locale
    );
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

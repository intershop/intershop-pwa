import { config as loadDotenv } from 'dotenv';

loadDotenv();

/** UCP spec/profile version advertised by this business. */
export const UCP_VERSION = '2026-04-08';

/** Base path under which the UCP catalog capability is served. */
export const UCP_BASE_PATH = '/ucp/v1';

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
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

/** Resolve the UCP configuration from environment variables. */
export function resolveUcpConfig(): UcpConfig {
  return {
    port: Number(process.env.UCP_PORT ?? 4000),
    publicBaseUrl: process.env.UCP_PUBLIC_BASE_URL ? stripTrailingSlash(process.env.UCP_PUBLIC_BASE_URL) : undefined,
    storefrontBaseUrl: process.env.STOREFRONT_BASE_URL
      ? stripTrailingSlash(process.env.STOREFRONT_BASE_URL)
      : undefined,
    icmBaseUrl: stripTrailingSlash(process.env.ICM_BASE_URL ?? 'https://develop.icm.intershop.de'),
    icmServer: process.env.ICM_SERVER ?? 'INTERSHOP/rest/WFS',
    icmChannel: process.env.ICM_CHANNEL ?? 'inSPIRED-inTRONICS-Site',
    icmApplication: process.env.ICM_APPLICATION ?? '-',
    locale: process.env.ICM_LOCALE ?? 'en_US',
    currency: process.env.ICM_CURRENCY ?? 'USD',
  };
}

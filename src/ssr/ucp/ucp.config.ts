import { environment } from '../../environments/environment';

/**
 * Self-contained UCP (Universal Commerce Protocol, https://ucp.dev) module.
 *
 * This is the only file in the module that is coupled to the PWA environment.
 * Everything else operates on the plain {@link UcpConfig} object, so the whole
 * `src/ssr/ucp` folder can later be extracted into a standalone service without
 * touching the PWA internals.
 */

/** UCP spec/profile version advertised by this business. */
export const UCP_VERSION = '2026-04-08';

/** Base path under which the UCP catalog capability is served. */
export const UCP_BASE_PATH = '/ucp/v1';

/** Resolved, plain configuration the rest of the module depends on. */
export interface UcpConfig {
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

/**
 * Resolve the UCP configuration from the runtime environment, reusing the same
 * ICM settings as the storefront and allowing dedicated overrides via env vars.
 */
export function resolveUcpConfig(): UcpConfig {
  return {
    icmBaseUrl: stripTrailingSlash(
      process.env.ICM_BASE_URL || environment.icmBaseURL || 'https://develop.icm.intershop.de'
    ),
    icmServer: process.env.ICM_SERVER || environment.icmServer || 'INTERSHOP/rest/WFS',
    icmChannel:
      process.env.UCP_ICM_CHANNEL || process.env.ICM_CHANNEL || environment.icmChannel || 'inSPIRED-inTRONICS-Site',
    icmApplication: process.env.ICM_APPLICATION || environment.icmApplication || '-',
    locale: process.env.UCP_LOCALE || environment.defaultLocale || 'en_US',
    currency: process.env.UCP_CURRENCY || 'USD',
  };
}

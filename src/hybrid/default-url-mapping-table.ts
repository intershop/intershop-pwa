import { environment } from '../environments/environment';

const ICM_CONFIG_MATCH = `^/${environment.icmURLPrefix}/${environment.icmWebURLPath}/${environment.icmServerGroup}/(?<channel>[\\w-]+)/(?<lang>\\w+)/(?<application>[\\w-]+)/\\w+`;
const PWA_CONFIG_BUILD = ';channel=$<channel>;lang=$<lang>;application=$<application>;redirect=1';

/**
 * Mapping table for running PWA and ICM in parallel
 */
export const HYBRID_MAPPING_TABLE: {
  /** ID for grouping */
  id: string;
  /** regex for detecting ICM URL */
  icm: string;
  /** regex for building ICM URL (w/o web url) */
  icmBuild: string;
  /** regex for detecting PWA URL */
  pwa: string;
  /** regex for building PWA URL */
  pwaBuild: string;
  /** handler */
  handledBy: 'icm' | 'pwa';
}[] = [
  {
    id: 'Home',
    icm: `${ICM_CONFIG_MATCH}/(Default|ViewHomepage)-Start`,
    icmBuild: `ViewHomepage-Start`,
    pwa: `^/home`,
    pwaBuild: `home${PWA_CONFIG_BUILD}`,
    handledBy: 'icm',
  },
  {
    id: 'PDP',
    icm: `${ICM_CONFIG_MATCH}/ViewProduct-Start.*(\\?|&)SKU=(?<sku>\\w+)`,
    icmBuild: `ViewProduct-Start?SKU=$<sku>`,
    pwa: `^/product/(?<sku>\\w+)`,
    pwaBuild: `product/$<sku>${PWA_CONFIG_BUILD}`,
    handledBy: 'pwa',
  },
];

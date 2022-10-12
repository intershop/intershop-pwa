export const ICM_CONFIG_MATCH = `^/INTERSHOP/web/WFS/(?<channel>[\\w-]+)/(?<lang>[\\w-]+)/(?<application>[\\w-]+)/(?<currency>[\\w-]+)`;

const PWA_CONFIG_BUILD = ';channel=$<channel>;lang=$<lang>;application=$<application>';

interface HybridMappingEntry {
  /** ID for grouping */
  id: string;
  /** regex for detecting ICM URL */
  icm: string;
  /** regex for building PWA URL */
  pwaBuild: string;
  /** regex for detecting PWA URL */
  pwa: string;
  /** regex for building ICM URL (w/o web url) */
  icmBuild: string;
  /** handler */
  handledBy: 'icm' | 'pwa';
}

/**
 * base for generating ICM URLs.
 *
 * usable variables:
 *  - channel
 *  - lang
 *  - application
 *  - currency
 */
export const ICM_WEB_URL = '/INTERSHOP/web/WFS/$<channel>/$<lang>/$<application>/$<currency>';

/**
 * Mapping table for running PWA and ICM in parallel
 *
 * NOTE:
 * THIS MAPPING TABLE IS JUST AN EXAMPLE IMPLEMENTATION.
 * It does not define mappings for all routes that could be handled in the PWA or the ICM.
 * It needs to be adapted according to the requirements of the particular project.
 */
export const HYBRID_MAPPING_TABLE: HybridMappingEntry[] = [
  {
    id: 'Home',
    icm: `${ICM_CONFIG_MATCH}/(Default-Start|ViewHomepage-Start).*$`,
    pwaBuild: `home${PWA_CONFIG_BUILD}`,
    pwa: `^/home.*$`,
    icmBuild: `ViewHomepage-Start`,
    handledBy: 'pwa',
  },
  {
    id: 'Product Detail Page',
    icm: `${ICM_CONFIG_MATCH}/ViewProduct-Start.*(\\?|&)SKU=(?<sku>[\\w-]+).*$`,
    pwaBuild: `product/$<sku>${PWA_CONFIG_BUILD}`,
    pwa: `/(?!cat)((?!.*-cat.*-sku).*-)?sku(.*?)(-cat(.*))?$`,
    icmBuild: `ViewProduct-Start?SKU=$2`,
    handledBy: 'pwa',
  },
  {
    id: 'Category Page',
    icm: `${ICM_CONFIG_MATCH}/ViewStandardCatalog-Browse.*(\\?|&)CatalogID=(?<catalog>[\\w-]+).*$`,
    pwaBuild: `category/$<catalog>${PWA_CONFIG_BUILD}`,
    pwa: `^/(?!category|categoryref/.*$)(.*-)?cat([^?]*)`,
    icmBuild: `ViewStandardCatalog-Browse?CatalogID=$2&CategoryName=$2`,
    handledBy: 'pwa',
  },
  {
    id: 'Shopping Basket',
    icm: `${ICM_CONFIG_MATCH}/.*ViewCart-View$`,
    pwaBuild: `basket${PWA_CONFIG_BUILD}`,
    pwa: '^/basket.*$',
    icmBuild: 'ViewCart-View',
    handledBy: 'icm',
  },
  {
    id: 'Login',
    icm: `${ICM_CONFIG_MATCH}/ViewUserAccount-ShowLogin.*$`,
    pwaBuild: `login${PWA_CONFIG_BUILD}`,
    pwa: '^/login.*$',
    icmBuild: 'ViewUserAccount-ShowLogin',
    handledBy: 'pwa',
  },
  {
    id: 'Password Reset',
    icm: `${ICM_CONFIG_MATCH}/ViewForgotLoginData-NewPassword\\?uid=(?<uid>[^&]+)&Hash=(?<hash>[0-9a-f-]+).*$`,
    pwaBuild: `forgotPassword/updatePassword${PWA_CONFIG_BUILD}?uid=$<uid>&Hash=$<hash>`,
    pwa: `^/forgotPassword/updatePassword?uid=([^&]+)&Hash=([0-9a-f-]+).*$`,
    icmBuild: 'ViewForgotLoginData-NewPassword\\?uid=$1&Hash=$2',
    handledBy: 'pwa',
  },
  {
    id: 'Content Pages',
    icm: `${ICM_CONFIG_MATCH}/ViewContent-Start\\?PageletEntryPointID=($<id>.*?)(&.*|)$`,
    pwaBuild: `page/$<id>${PWA_CONFIG_BUILD}`,
    pwa: '^/page/(.*)$',
    icmBuild: 'ViewContent-Start?PageletEntryPointID=$1',
    handledBy: 'icm',
  },
  {
    id: 'My Account',
    icm: `${ICM_CONFIG_MATCH}/ViewUserAccount-Start.*$`,
    pwaBuild: `account${PWA_CONFIG_BUILD}`,
    pwa: '^/account.*$',
    icmBuild: 'ViewUserAccount-Start',
    handledBy: 'pwa',
  },
  {
    id: 'Register',
    icm: `${ICM_CONFIG_MATCH}/ViewUserAccount-ShowRegister.*$`,
    pwaBuild: `register${PWA_CONFIG_BUILD}`,
    pwa: '^/register.*$',
    icmBuild: 'ViewUserAccount-ShowRegister',
    handledBy: 'pwa',
  },
  {
    id: 'Product Compare',
    icm: `${ICM_CONFIG_MATCH}/ViewProductCompare-Show.*$`,
    pwaBuild: `compare${PWA_CONFIG_BUILD}`,
    pwa: '^/compare.*$',
    icmBuild: 'ViewProductCompare-Show',
    handledBy: 'pwa',
  },
  {
    id: 'Quick Order',
    icm: `${ICM_CONFIG_MATCH}/ViewQuickorder-Start.*$`,
    pwaBuild: `quick-order${PWA_CONFIG_BUILD}`,
    pwa: '^/quick-order.*$',
    icmBuild: 'ViewQuickorder-Start',
    handledBy: 'icm',
  },
];

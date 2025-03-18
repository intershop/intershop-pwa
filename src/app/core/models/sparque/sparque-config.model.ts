/**
 * Configuration settings for the Sparque connections.
 */
export interface SparqueConfig {
  // base url of the sparque wrapper server
  serverUrl: string;
  // version of the sparque wrapper REST API
  wrapperApi: string;
  // sparque workspace name
  workspaceName: string;
  // sparque API name
  apiName: string;
  // sparque deployment configuration e.g. production
  config?: string;
  // id of channel where sparque product data are assigned to
  channelId?: string;
  // flag to enable/disable sparque prices
  enablePrices?: boolean;

  [key: string]: unknown;
}

export function getEmptySparqueConfig(): SparqueConfig {
  return {
    serverUrl: '',
    wrapperApi: '',
    workspaceName: '',
    apiName: '',
    channelId: '',
    enablePrices: true,
  };
}

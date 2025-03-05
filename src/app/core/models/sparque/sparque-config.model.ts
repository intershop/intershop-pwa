/**
 * Configuration settings for the Sparque connections.
 */
export interface SparqueConfig {
  // base url of the sparque wrapper server
  server_url: string;
  // version of the sparque wrapper REST API
  wrapperAPI: string;
  // sparque workspace name
  workspaceName: string;
  // sparque API name
  apiName: string;
  // sparque deployment configuration e.g. production
  config?: string;
  // id of channel where sparque product data are assigned to
  channelId?: string;

  [key: string]: unknown;
}

export function getEmptySparqueConfig(): SparqueConfig {
  return { server_url: '', wrapperAPI: '', workspaceName: '', apiName: '', channelId: '' };
}

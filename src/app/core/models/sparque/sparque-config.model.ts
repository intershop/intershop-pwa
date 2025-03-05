/**
 * Configuration settings for the Sparque connections.
 */
export interface SparqueConfig {
  // base url of the sparque wrapper server
  serverUrl: string;
  // version of the sparque wrapper REST API
  wrapperApi: string;
  // sparque workspace name
  WorkspaceName: string;
  // sparque API name
  ApiName: string;
  // sparque deployment configuration e.g. production
  config?: string;
  // id of channel where sparque product data are assigned to
  ChannelId?: string;

  [key: string]: unknown;
}

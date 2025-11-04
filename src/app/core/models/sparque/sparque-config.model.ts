/**
 * Available Sparque features that can be enabled
 */
export const SPARQUE_FEATURES: {
  readonly CATEGORY: 'category';
  readonly RECOMMENDATIONS: 'recommendations';
  readonly SEARCH: 'search';
  readonly SUGGESTIONS: 'suggestions';
} = {
  CATEGORY: 'category',
  RECOMMENDATIONS: 'recommendations',
  SEARCH: 'search',
  SUGGESTIONS: 'suggestions',
};

/**
 * Type for Sparque feature values
 */
type SparqueFeature = (typeof SPARQUE_FEATURES)[keyof typeof SPARQUE_FEATURES];

/**
 * Configuration settings for the Sparque connections.
 */
export interface SparqueConfig {
  // base url of the sparque wrapper server
  serverUrl: string;
  // sparque workspace name
  workspaceName: string;
  // sparque API name
  apiName: string;
  // sparque deployment configuration e.g. production
  config?: string;
  // id of channel where sparque product data are assigned to
  channelId?: string;
  // enabled features
  features: SparqueFeature[];

  // additional custom settings
  [key: string]: unknown;
}

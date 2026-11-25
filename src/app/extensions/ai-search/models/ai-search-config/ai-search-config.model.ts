/**
 * Configuration of the Flowise chatflow that generates the AI answers of AI Search.
 */
export interface AiSearchConfig {
  /** URL of the Flowise API host, e.g. `https://<FLOWISE-API-HOST>`. */
  apiHost: string;
  /** Project specific ID of the AI Search chatflow. */
  chatflowid: string;
}

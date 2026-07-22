/**
 * model for config data (parameters, services etc.) retrieved from the ICM server.
 */
export interface ServerConfig {
  [key: string]: boolean | ServerConfig | string | string[];
}

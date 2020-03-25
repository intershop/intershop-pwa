/**
 * model for config data (parameters, services etc.) retrieved from the ICM server.
 */

export interface ServerConfig {
  [id: string]: {
    [key: string]: string | boolean;
  };
}

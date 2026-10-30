/**
 * Configuration for the Copilot Embedded Flowise integration.
 */
export interface CopilotEmbeddedConfig {
  /** URL of the Flowise API host, e.g. `https://<FLOWISE-API-HOST>`. */
  apiHost: string;
  /** Project specific Flowise chatflow ID. */
  chatflowid: string;
  /** Additional chatflow variables merged into every prediction request. */
  chatflowConfig?: { vars?: Record<string, unknown> };
  /**
   * Forces the response mode. `true` always streams, `false` always uses the non-streaming request.
   * When omitted, the chatflow's streaming capability is probed automatically (default behavior).
   */
  streaming?: boolean;
}

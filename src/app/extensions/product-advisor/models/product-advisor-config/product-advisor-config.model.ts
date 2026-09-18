/**
 * Configuration for the Product Advisor Flowise integration.
 *
 * Unlike the Copilot, the Product Advisor does not load a pre-built chat UI (`web.js`).
 * The PWA owns the UI and talks to the Flowise Prediction API directly, so only the
 * connection details and optional chatflow variables are needed here.
 */
export interface ProductAdvisorConfig {
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

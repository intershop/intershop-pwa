export interface CopilotConfig {
  copilotUIFile: string;
  chatflowid: string;
  apiHost: string;
  chatflowConfig?: { vars?: Record<string, unknown> };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme?: any;
  /**
   * If true, the Nyris image search bridge is activated.
   * Images uploaded by the user are routed to overrideConfig.vars.uploads
   * instead of being sent directly to the LLM.
   */
  imageRoutingEnabled?: boolean;
}

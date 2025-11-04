export interface CopilotConfig {
  copilotUIFile: string;
  chatflowid: string;
  apiHost: string;
  chatflowConfig?: { vars: { [key: string]: unknown } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme?: any;
}

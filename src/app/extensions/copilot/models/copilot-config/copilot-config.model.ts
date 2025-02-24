export interface CopilotConfig {
  copilotUIFile: string;
  chatflowid: string;
  apiHost: string;
  chatflowConfig?: { vars: { [key: string]: string } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme?: any;
}

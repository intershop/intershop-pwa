export interface CxmlConfiguration {
  name: string;
  value: string;
  defaultValue?: string;
  description?: string;
  inputType?: CxmlConfigurationInputType;
}

export type CxmlConfigurationInputType = 'text-short' | 'text-long';

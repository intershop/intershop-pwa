import { CxmlConfigurationInputType } from './cxml-configuration.model';

export interface CxmlConfigurationData {
  data: {
    name: string;
    value: string;
  }[];
  info?: {
    metaData: {
      name: string;
      defaultValue?: string;
      description?: string;
      inputType?: CxmlConfigurationInputType;
    }[];
  };
}

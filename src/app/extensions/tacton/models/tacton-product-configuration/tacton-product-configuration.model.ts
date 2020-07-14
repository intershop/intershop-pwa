export interface TactonProductConfigurationGroup {
  isGroup: true;
  isParameter: false;
  name: string;
  description: string;
  hasVisibleParameters: boolean;
  members: (TactonProductConfigurationGroup | TactonProductConfigurationParameter)[];
}

export interface TactonProductConfigurationParameter {
  isGroup: false;
  isParameter: true;
  name: string;
  description: string;
  value: string;
  valueDescription: string;
  committed: boolean;
  alwaysCommitted: boolean;
  properties: {
    hidden: 'no' | 'yes';
    guitype: 'text' | 'dropdown' | 'radio' | 'readonly';
    tc_info_text: string;
  };
  domain: {
    name: string;
    max?: string;
    min?: string;
    elements: {
      name: string;
      description: string;
      selected: boolean;
    }[];
  };
}

export interface TactonProductConfiguration {
  configId?: string;
  configState?: string;
  tab?: string;
  productId?: string;
  steps: {
    name: string;
    description: string;
    current: boolean;
    available: boolean;
    rootGroup?: {
      name: string;
      description: string;
      hasVisibleParameters: boolean;
      members: (TactonProductConfigurationGroup | TactonProductConfigurationParameter)[];
    };
  }[];
  bom: {
    attributes: { [attrId: string]: string };
    description: string;
    name: string;
    qty: string;
  }[];
}

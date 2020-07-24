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
    guitype: 'text' | 'dropdown' | 'radio' | 'readonly' | 'imagetext_buttons' | 'text_buttons' | 'selected_image';
    tc_info_text: string;
    tc_component_picture?: string;
  };
  domain: {
    name: string;
    max?: string;
    min?: string;
    elements: {
      name: string;
      description: string;
      selected: boolean;
      properties: {
        tc_component_picture?: string;
      };
    }[];
  };
}

export interface TactonProductConfigurationBomItem {
  attributes: { [attrId: string]: string };
  description: string;
  name: string;
  qty: string;
}

export interface TactonProductConfigurationConflictItem {
  description: string;
  name: string;
  newValue: string;
  newValueDescription: string;
  oldValue: string;
  oldValueDescription: string;
}

export interface TactonProductConfiguration {
  externalId?: string; // added by PWA
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
  bom: TactonProductConfigurationBomItem[];
  response: {
    status: 'OK' | 'RESOLVABLE';
    changed?: TactonProductConfigurationConflictItem[];
  };
}

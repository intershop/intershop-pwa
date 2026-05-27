import { ContentConfigurationParameterData } from 'ish-core/models/content-configuration-parameter/content-configuration-parameter.interface';
import { ContentSlotData } from 'ish-core/models/content-slot/content-slot.interface';

export interface ContentPageletData {
  definitionQualifiedName: string;
  id: string;
  displayName: string;
  domain: string;
  configurationParameters?: Record<string, ContentConfigurationParameterData>;
  slots?: Record<string, ContentSlotData>;
}

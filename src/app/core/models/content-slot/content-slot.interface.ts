import { ContentConfigurationParameterData } from 'ish-core/models/content-configuration-parameter/content-configuration-parameter.interface';
import { ContentPageletData } from 'ish-core/models/content-pagelet/content-pagelet.interface';

export interface ContentSlotData {
  definitionQualifiedName: string;
  displayName: string;
  pagelets: ContentPageletData[];
  configurationParameters?: { [name: string]: ContentConfigurationParameterData };
}

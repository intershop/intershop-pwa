import { ContentConfigurationParameterData } from '../content-configuration-parameter/content-configuration-parameter.interface';
import { ContentPageletData } from '../content-pagelet/content-pagelet.interface';

export interface ContentSlotData {
  definitionQualifiedName: string;
  pagelets: ContentPageletData[];
  configurationParameters?: { [name: string]: ContentConfigurationParameterData };
}

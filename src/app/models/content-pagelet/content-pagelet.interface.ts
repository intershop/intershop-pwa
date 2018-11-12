import { ContentConfigurationParameterData } from '../content-configuration-parameter/content-configuration-parameter.interface';
import { ContentSlotData } from '../content-slot/content-slot.interface';

export interface ContentPageletData {
  definitionQualifiedName: string;
  id: string;
  displayName: string;
  configurationParameters?: { [name: string]: ContentConfigurationParameterData };
  slots?: { [definitionQualifiedName: string]: ContentSlotData };
}

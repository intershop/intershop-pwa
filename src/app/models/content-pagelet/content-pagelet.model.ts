import { ContentConfigurationParameters } from '../content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentSlot } from '../content-slot/content-slot.model';

export interface ContentPagelet {
  definitionQualifiedName: string;
  id: string;
  configurationParameters?: ContentConfigurationParameters;
  slots?: ContentSlot[];
}

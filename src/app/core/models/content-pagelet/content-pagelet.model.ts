import { ContentConfigurationParameters } from 'ish-core/models/content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentSlot } from 'ish-core/models/content-slot/content-slot.model';

export interface ContentPagelet {
  definitionQualifiedName: string;
  id: string;
  displayName: string;
  domain: string;
  configurationParameters?: ContentConfigurationParameters;
  slots?: ContentSlot[];
}

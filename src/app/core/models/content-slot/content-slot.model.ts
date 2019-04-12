import { ContentConfigurationParameters } from '../content-configuration-parameter/content-configuration-parameter.mapper';

export interface ContentSlot {
  definitionQualifiedName: string;
  displayName: string;
  pageletIDs?: string[];
  configurationParameters?: ContentConfigurationParameters;
}

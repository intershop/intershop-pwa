import { ContentConfigurationParameters } from '../content-configuration-parameter/content-configuration-parameter.mapper';

export interface ContentEntryPoint {
  id: string;
  definitionQualifiedName: string;
  displayName: string;
  pageletIDs?: string[];
  configurationParameters?: ContentConfigurationParameters;
}

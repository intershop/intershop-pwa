import { ContentConfigurationParameters } from 'ish-core/models/content-configuration-parameter/content-configuration-parameter.mapper';

export interface ContentPageletEntryPoint {
  id: string;
  definitionQualifiedName: string;
  displayName: string;
  domain: string;
  resourceSetId: string;
  pageletIDs?: string[];
  configurationParameters?: ContentConfigurationParameters;
}

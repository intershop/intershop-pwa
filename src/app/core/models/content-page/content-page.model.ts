import { ContentConfigurationParameters } from '../content-configuration-parameter/content-configuration-parameter.mapper';
import { Link } from '../link/link.model';

export interface ContentPage {
  id: string;
  definitionQualifiedName: string;
  link: Link;
  displayName: string;
  pageletIDs?: string[];
  configurationParameters?: ContentConfigurationParameters;
}

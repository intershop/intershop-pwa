import { ContentConfigurationParameterData } from 'ish-core/models/content-configuration-parameter/content-configuration-parameter.interface';
import { ContentPageletData } from 'ish-core/models/content-pagelet/content-pagelet.interface';
import { Link } from 'ish-core/models/link/link.model';

export interface ContentPageletEntryPointData {
  id: string;
  definitionQualifiedName: string;
  displayName: string;
  domain: string;
  resourceSetId: string;
  pagelets: ContentPageletData[];
  configurationParameters?: { [name: string]: ContentConfigurationParameterData };
  link: Link;
}

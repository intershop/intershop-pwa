import { ContentConfigurationParameterData } from '../content-configuration-parameter/content-configuration-parameter.interface';
import { ContentPageletData } from '../content-pagelet/content-pagelet.interface';
import { Link } from '../link/link.model';

export interface ContentEntryPointData {
  id: string;
  definitionQualifiedName: string;
  displayName: string;
  pagelets: ContentPageletData[];
  configurationParameters?: { [name: string]: ContentConfigurationParameterData };
  link: Link;
}

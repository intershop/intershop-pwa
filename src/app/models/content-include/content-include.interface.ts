import { ContentConfigurationParameter } from '../content-configuration-parameter/content-configuration-parameter.model';
import { ContentPagelet } from '../content-pagelet/content-pagelet.model';
import { Link } from '../link/link.model';

export interface ContentIncludeData {
  definitionQualifiedName: string;
  displayName: string;
  pagelets: ContentPagelet[];
  configurationParameters?: { [name: string]: ContentConfigurationParameter };
  link: Link;
}

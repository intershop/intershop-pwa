import { ContentConfigurationParameter } from '../content-configuration-parameter/content-configuration-parameter.model';
import { ContentPagelet } from '../content-pagelet/content-pagelet.model';
import { Link } from '../link/link.model';

export interface ContentSlot {
  definitionQualifiedName: string;
  link: Link;
  pagelets: ContentPagelet[];
  configurationParameters?: { [name: string]: ContentConfigurationParameter };
}

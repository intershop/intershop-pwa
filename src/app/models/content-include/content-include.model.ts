import { ContentConfigurationParameter } from '../content-configuration-parameter/content-configuration-parameter.model';
import { ContentPagelet } from '../content-pagelet/content-pagelet.model';

export interface ContentInclude {
  id: string;
  displayName: string;
  pagelets: ContentPagelet[];
  configurationParameters?: { [name: string]: ContentConfigurationParameter };
}

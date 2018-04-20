import { ContentConfigurationParameter } from '../content-configuration-parameter/content-configuration-parameter.model';
import { ContentSlot } from '../content-slot/content-slot.model';
import { Link } from '../link/link.model';

export interface ContentPagelet {
  definitionQualifiedName: string;
  id: string;
  displayName: string;
  configurationParameters?: { [name: string]: ContentConfigurationParameter };
  slots?: { [definitionQualifiedName: string]: ContentSlot };
  link: Link;
}

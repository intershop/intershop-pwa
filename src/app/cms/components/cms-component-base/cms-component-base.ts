import { HostBinding, Input } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { CMSComponentInterface } from '../../configurations/injection-keys';

/* tslint:disable:project-structure */
export class CMSComponentBase implements CMSComponentInterface {
  @Input()
  pagelet: ContentPageletView;

  @HostBinding('attr.data-cms-dqn') cmsDQNAttribute: string;
}

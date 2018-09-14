// tslint:disable:ccp-no-markup-in-containers
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentConfigurationParameters } from '../../../models/content-configuration-parameter/content-configuration-parameter.mapper';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';

@Component({
  selector: 'ish-content-pagelet',
  templateUrl: './content-pagelet.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageletContainerComponent {
  @Input()
  pagelet: ContentPagelet;

  stringify(object: ContentConfigurationParameters): string {
    return JSON.stringify(object);
  }
}

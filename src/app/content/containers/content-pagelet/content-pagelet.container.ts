// tslint:disable:ccp-no-markup-in-containers
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';

@Component({
  selector: 'ish-content-pagelet',
  templateUrl: './content-pagelet.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageletContainerComponent {
  @Input()
  pagelet: ContentPagelet;

  stringify(object: any): string {
    return JSON.stringify(object);
  }
}

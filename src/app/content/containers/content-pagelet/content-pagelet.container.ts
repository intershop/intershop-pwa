// tslint:disable:ccp-no-markup-in-containers
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from '../../../models/content-view/content-views';

@Component({
  selector: 'ish-content-pagelet',
  templateUrl: './content-pagelet.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageletContainerComponent {
  @Input()
  pagelet: ContentPageletView;
}

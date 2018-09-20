import { ChangeDetectionStrategy, Component, DoCheck, Inject, Input } from '@angular/core';

import { STATIC_URL } from '../../../core/services/state-transfer/factories';
import { ContentImagePageletView, createImagePageletView } from '../../../models/content-view/content-image-view';

// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-cms-image',
  templateUrl: './cms-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSImageComponent implements DoCheck {
  @Input()
  pagelet: ContentImagePageletView;

  constructor(@Inject(STATIC_URL) public staticURL: string) {}

  ngDoCheck() {
    this.pagelet = createImagePageletView(this.pagelet);
  }
}

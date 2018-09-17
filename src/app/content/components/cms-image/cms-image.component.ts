import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges } from '@angular/core';

import { STATIC_URL } from '../../../core/services/state-transfer/factories';
import { ContentImagePageletView, createImagePageletView } from '../../../models/content-view/content-image-view';
import { ContentPageletView } from '../../../models/content-view/content-views';

// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-cms-image',
  templateUrl: './cms-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSImageComponent implements OnChanges {
  // tslint:disable-next-line:no-input-rename
  @Input('pagelet')
  private incomingPagelet: ContentPageletView;
  pagelet: ContentImagePageletView;

  constructor(@Inject(STATIC_URL) public staticURL: string) {}

  ngOnChanges() {
    this.pagelet = createImagePageletView(this.incomingPagelet);
  }
}

import { ChangeDetectionStrategy, Component, DoCheck, Inject, Input } from '@angular/core';

import { ContentImagePageletView, createImagePageletView } from 'ish-core/models/content-view/content-image-view';
import { ContentViewHelper } from 'ish-core/models/content-view/content-view.helper';
import { STATIC_URL } from 'ish-core/utils/state-transfer/factories';

@Component({
  selector: 'ish-cms-image',
  templateUrl: './cms-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSImageComponent implements DoCheck {
  @Input()
  pagelet: ContentImagePageletView;

  routerLink = ContentViewHelper.getRouterLink;

  constructor(@Inject(STATIC_URL) public staticURL: string) {}

  ngDoCheck() {
    if (this.pagelet && !this.pagelet.imagePath) {
      // tslint:disable-next-line:no-assignement-to-inputs
      this.pagelet = createImagePageletView(this.pagelet);
    }
  }
}

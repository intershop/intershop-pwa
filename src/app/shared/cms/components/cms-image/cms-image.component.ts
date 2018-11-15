import { ChangeDetectionStrategy, Component, DoCheck, Inject, Input } from '@angular/core';

import { ContentImagePageletView, createImagePageletView } from 'ish-core/models/content-view/content-image-view';
import { STATIC_URL } from 'ish-core/services/state-transfer/factories';

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
    if (this.pagelet && !this.pagelet.routerLink) {
      // tslint:disable-next-line:no-assignement-to-inputs
      this.pagelet = createImagePageletView(this.pagelet);
    }
  }
}

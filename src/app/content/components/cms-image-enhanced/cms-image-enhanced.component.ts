import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { STATIC_URL } from '../../../core/services/state-transfer/factories';
import { ContentImagePageletView, createImagePageletView } from '../../../models/content-view/content-image-view';

@Component({
  selector: 'ish-cms-image-enhanced',
  templateUrl: './cms-image-enhanced.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSImageEnhancedComponent {
  private pageletInternal: ContentImagePageletView;

  constructor(@Inject(STATIC_URL) public staticURL: string) {}

  get pagelet(): ContentImagePageletView {
    return this.pageletInternal;
  }

  set pagelet(newVal) {
    this.pageletInternal = createImagePageletView(newVal);
  }
}

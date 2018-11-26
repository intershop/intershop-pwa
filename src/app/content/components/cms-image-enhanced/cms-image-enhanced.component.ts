import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { STATIC_URL } from 'ish-core/services/state-transfer/factories';
import { CMSImageComponent } from '../cms-image/cms-image.component';

@Component({
  selector: 'ish-cms-image-enhanced',
  templateUrl: './cms-image-enhanced.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSImageEnhancedComponent extends CMSImageComponent {
  constructor(@Inject(STATIC_URL) public staticURL: string) {
    super(staticURL);
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentViewHelper } from 'ish-core/models/content-view/content-view.helper';
import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { SfeMetadataWrapper } from '../../../cms/sfe-adapter/sfe-metadata-wrapper';

@Component({
  selector: 'ish-cms-image-enhanced',
  templateUrl: './cms-image-enhanced.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSImageEnhancedComponent extends SfeMetadataWrapper {
  @Input() pagelet: ContentPageletView;
  routerLink = ContentViewHelper.getRouterLink;
}

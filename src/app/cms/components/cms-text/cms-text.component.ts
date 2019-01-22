import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { SfeMetadataWrapper } from '../../../cms/sfe-adapter/sfe-metadata-wrapper';

@Component({
  selector: 'ish-cms-text',
  templateUrl: './cms-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSTextComponent extends SfeMetadataWrapper {
  @Input() pagelet: ContentPageletView;
}

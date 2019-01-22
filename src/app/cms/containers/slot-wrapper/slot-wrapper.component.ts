import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { SfeMetadataWrapper } from '../../../cms/sfe-adapter/sfe-metadata-wrapper';
import { SfeMapper } from '../../../cms/sfe-adapter/sfe.mapper';
// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-slot-wrapper',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotWrapperComponent extends SfeMetadataWrapper implements OnChanges {
  @Input() slot: string;
  @Input() pagelet?: ContentPageletView;

  ngOnChanges() {
    if (this.pagelet) {
      this.setSfeMetadata(SfeMapper.mapSlotViewToSfeMetadata(this.pagelet, this.slot));
    }
  }
}

// tslint:disable:project-structure
// tslint:disable:ccp-no-intelligence-in-components
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { SfeAdapterService } from '../../../cms/sfe-adapter/sfe-adapter.service';
import { SfeMetadataWrapper } from '../../../cms/sfe-adapter/sfe-metadata-wrapper';
import { SfeMapper } from '../../../cms/sfe-adapter/sfe.mapper';
@Component({
  selector: 'ish-slot-wrapper',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotWrapperComponent extends SfeMetadataWrapper implements OnChanges {
  @Input() slot: string;
  @Input() pagelet?: ContentPageletView;

  constructor(private sfeAdapter: SfeAdapterService) {
    super();
  }

  ngOnChanges() {
    if (this.pagelet && this.sfeAdapter.isInitialized()) {
      this.setSfeMetadata(SfeMapper.mapSlotViewToSfeMetadata(this.pagelet, this.slot));
    }
  }
}

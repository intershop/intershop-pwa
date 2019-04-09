// tslint:disable:ccp-no-intelligence-in-components
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { SfeAdapterService } from '../../sfe-adapter/sfe-adapter.service';
import { SfeMetadataWrapper } from '../../sfe-adapter/sfe-metadata-wrapper';
import { SfeMapper } from '../../sfe-adapter/sfe.mapper';

@Component({
  selector: 'ish-content-slot-wrapper',
  templateUrl: './content-slot-wrapper.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentSlotWrapperContainerComponent extends SfeMetadataWrapper implements OnChanges {
  @Input() slot: string;
  @Input() pagelet: ContentPageletView;

  constructor(private sfeAdapter: SfeAdapterService) {
    super();
  }

  ngOnChanges() {
    if (this.pagelet && this.sfeAdapter.isInitialized()) {
      this.setSfeMetadata(SfeMapper.mapSlotViewToSfeMetadata(this.pagelet, this.slot));
    }
  }
}

import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { SfeAdapterService } from 'ish-shared/cms/sfe-adapter/sfe-adapter.service';
import { SfeMetadataWrapper } from 'ish-shared/cms/sfe-adapter/sfe-metadata-wrapper';
import { SfeMapper } from 'ish-shared/cms/sfe-adapter/sfe.mapper';

/**
 * The Content Slot Container Component renders the assigned sub pagelets
 * of the identified 'slot' of the given 'pagelet'.
 * By default it is just using the {@link ContentPageletContainerComponent}
 * to render each sub pagelet.
 * If more specific HTML or functionality is needed for the rendering
 * the 'wrapper' flag needs to be used to use the provided HTML for rendering.
 *
 * @example
 * <ish-content-slot [slot]="'app_pwa:slot.pagelet2-Slot'" [pagelet]="pagelet"></ish-content-slot>
 *
 * <ish-content-slot [wrapper]="true" [slot]="'app_pwa:slot.pagelet2-Slot'" [pagelet]="pagelet">
 *               <div *ngFor="let slotPagelet of slotPagelets">
 *                 <ish-content-pagelet [pageletId]="slotPagelet"></ish-content-pagelet>
 *               </div>
 * </ish-content-slot>
 */
@Component({
  selector: 'ish-content-slot',
  templateUrl: './content-slot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentSlotComponent extends SfeMetadataWrapper implements OnChanges {
  /**
   * The DefinitionQualifiedName of the slot that should be rendered.
   */
  @Input() slot: string;
  /**
   * The parent Pagelet that contains the slot.
   */
  @Input() pagelet: ContentPageletView;
  /**
   * An optional flag that controls the rendering of the pagelets with the wrapped HTML content.
   */
  @Input() wrapper?: boolean;

  constructor(private sfeAdapter: SfeAdapterService) {
    super();
  }

  ngOnChanges() {
    if (this.pagelet && this.sfeAdapter.isInitialized()) {
      this.setSfeMetadata(SfeMapper.mapSlotViewToSfeMetadata(this.pagelet, this.slot));
    }
  }
}

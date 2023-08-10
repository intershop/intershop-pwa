import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView, ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { DesignViewService } from 'ish-core/utils/design-view/design-view.service';
import { PreviewService } from 'ish-core/utils/preview/preview.service';

@Component({
  selector: 'ish-content-designview-wrapper',
  templateUrl: './content-designview-wrapper.component.html',
  styleUrls: ['./content-designview-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentDesignviewWrapperComponent implements OnInit {
  // pagelet parameter
  @Input() pageletId: string;
  // slot parameters
  @Input() pagelet: ContentPageletView;
  @Input() slotId: string;
  // include parameter
  @Input() include: ContentPageletEntryPointView;

  pagelet$: Observable<ContentPageletView>;
  type: 'pagelet' | 'slot' | 'include';

  isDesignViewMode = false; // temporary activation switch

  constructor(
    private cmsFacade: CMSFacade,
    private previewService: PreviewService,
    private designViewService: DesignViewService
  ) {}

  ngOnInit() {
    if (this.pageletId) {
      this.type = 'pagelet';
      this.pagelet$ = this.cmsFacade.pagelet$(this.pageletId);
    } else if (this.slotId) {
      this.type = 'slot';
    } else if (this.include) {
      this.type = 'include';
    }

    // TODO: replace usage of previewContextId to identify Design View mode
    this.isDesignViewMode = this.previewService.previewContextId === 'DESIGNVIEW';
  }

  triggerAction(id: string, action: string) {
    this.designViewService.messageToHost({ type: 'dv-clientAction', payload: { id, action } });
  }
}

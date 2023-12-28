import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView, ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { DesignViewService } from 'ish-core/utils/design-view/design-view.service';
import { PreviewService } from 'ish-core/utils/preview/preview.service';

@Component({
  selector: 'ish-content-design-view-wrapper',
  templateUrl: './content-design-view-wrapper.component.html',
  styleUrls: ['./content-design-view-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentDesignViewWrapperComponent implements OnInit {
  // pagelet parameter
  @Input() pageletId: string;
  // slot parameters
  @Input() slotId: string;
  @Input() pagelet: ContentPageletView;
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

    this.isDesignViewMode = this.previewService.isDesignViewMode;
  }

  triggerAction(id: string, action: string) {
    this.designViewService.messageToHost({ type: 'dv-clientAction', payload: { id, action } });
  }
}

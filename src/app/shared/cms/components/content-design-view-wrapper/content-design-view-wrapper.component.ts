import { AsyncPipe, NgClass, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, combineLatest, map } from 'rxjs';

import { ScrollDirective } from 'ish-core/directives/scroll.directive';
import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView, ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { DesignViewService } from 'ish-core/utils/design-view/design-view.service';
import { PreviewService } from 'ish-core/utils/preview/preview.service';

@Component({
  selector: 'ish-content-design-view-wrapper',
  templateUrl: './content-design-view-wrapper.component.html',
  styleUrls: ['./content-design-view-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgClass,
    NgSwitch,
    NgIf,
    TranslatePipe,
    AsyncPipe,
    NgTemplateOutlet,
    NgSwitchCase,
    ScrollDirective,
  ],
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

  isDesignViewMode = false;

  isPageletSelected$: Observable<boolean>;
  isPageletPreviewed$: Observable<boolean>;
  shouldScroll$: Observable<boolean>;

  constructor(
    private cmsFacade: CMSFacade,
    private previewService: PreviewService,
    private designViewService: DesignViewService
  ) {}

  ngOnInit() {
    this.isDesignViewMode = this.previewService.isDesignViewMode;

    if (this.isDesignViewMode) {
      this.initializeComponent();
    }
  }

  onPageletHover() {
    if (this.isDesignViewMode && this.pageletId) {
      this.triggerAction(this.pageletId, 'pageletPreview');
    }
  }

  onPageletLeave() {
    if (this.isDesignViewMode) {
      this.triggerAction(undefined, 'pageletPreview');
    }
  }

  triggerAction(id: string, action: string) {
    this.designViewService.messageToHost({ type: 'dv-clientAction', payload: { id, action } });
  }

  private initializeComponent() {
    if (this.pageletId) {
      this.type = 'pagelet';
      this.pagelet$ = this.cmsFacade.pagelet$(this.pageletId);

      this.isPageletSelected$ = this.cmsFacade.designViewSelectedPageletId$.pipe(
        map(id => (this.isDesignViewMode ? this.pageletId === id : false))
      );

      this.isPageletPreviewed$ = combineLatest([
        this.cmsFacade.designViewPreviewedPageletId$,
        this.cmsFacade.designViewSelectedPageletId$,
      ]).pipe(
        map(
          ([previewedId, selectedId]) =>
            this.isDesignViewMode && this.pageletId === previewedId && this.pageletId !== selectedId
        )
      );

      this.shouldScroll$ = this.cmsFacade.designViewScrollToPageletId$.pipe(
        map(id => this.isDesignViewMode && id === this.pageletId)
      );
    } else if (this.slotId) {
      this.type = 'slot';
    } else if (this.include) {
      this.type = 'include';
    }
  }
}

import { AsyncPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { ContentPageRoutePipe } from 'ish-core/routing/content-page/content-page-route.pipe';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';

/**
 * The Content Page Navigation Component to get content page hierarchy navigation.
 */
@Component({
  selector: 'ish-content-navigation',
  templateUrl: './content-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgTemplateOutlet,
    AsyncPipe,
    NgClass,
    RouterLink,
    ContentPageRoutePipe,
    SkipContentLinkComponent,
  ],
})
export class ContentNavigationComponent implements OnInit {
  /**
   * Content Page Tree to be rendered
   */
  @Input({ required: true }) contentPageTree: ContentPageTreeView;
  /**
   * Max Depth of page tree
   */
  @Input({ required: true }) depth: number;

  currentContentPage$: Observable<ContentPageletEntryPointView>;

  constructor(private cmsFacade: CMSFacade) {}

  ngOnInit() {
    this.currentContentPage$ = this.cmsFacade.contentPage$;
  }
}

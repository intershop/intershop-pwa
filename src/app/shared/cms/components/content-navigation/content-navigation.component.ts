import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';

/**
 * The Content Page Navigation Component to get content page hierarchy navigation.
 */
@Component({
  selector: 'ish-content-navigation',
  templateUrl: './content-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentNavigationComponent implements OnInit {
  /**
   * Content Page Tree to be rendered
   */
  @Input() contentPageTree: ContentPageTreeView;
  /**
   * Max Depth of page tree
   */
  @Input() depth: number;

  currentContentPage$: Observable<ContentPageletEntryPointView>;

  constructor(private cmsFacade: CMSFacade) {}

  ngOnInit() {
    this.currentContentPage$ = this.cmsFacade.contentPage$;
  }
}

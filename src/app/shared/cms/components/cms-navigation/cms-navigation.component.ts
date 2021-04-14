import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletTreeView } from 'ish-core/models/content-pagelet-tree-view/content-pagelet-tree-view.model';

/**
 * The CMS Static Page Component to render CMS managed static content pages.
 * With optional side panel and (TODO: content page hierarchy navigation)
 */
@Component({
  selector: 'ish-cms-navigation',
  templateUrl: './cms-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSNavigationComponent implements OnInit, OnChanges {
  /**
   * Id of current page tree element
   */
  @Input() uniqueId: string;
  /**
   * Id of page tree root
   */
  @Input() root: string;
  /**
   * Max Depth of page tree
   */
  @Input() maxDepth: number;
  /**
   * Depth of current page tree
   */
  @Input() actualDepth: number;

  contentPageTree$: Observable<ContentPageletTreeView>;
  currentContentPageId$: Observable<string>;

  constructor(private cmsFacade: CMSFacade) {}

  ngOnInit() {
    this.currentContentPageId$ = this.cmsFacade.selectedContentPageId$;
  }

  ngOnChanges() {
    this.contentPageTree$ = this.cmsFacade.getContentPageTreeView$(this.uniqueId);
  }
}

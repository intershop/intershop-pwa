import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';

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
   * Id of page tree root
   */
  @Input() root: string;
  /**
   * Max Depth of page tree
   */
  @Input() depth: number;

  contentPageTreeView$: Observable<ContentPageTreeView[]>;
  currentContentPageId$: Observable<string>;
  rootDisplayName$: Observable<string>;

  constructor(private cmsFacade: CMSFacade) {}

  ngOnInit() {
    this.currentContentPageId$ = this.cmsFacade.contentPage$.pipe(map(contentPage => contentPage?.id));
  }

  ngOnChanges() {
    this.contentPageTreeView$ = this.cmsFacade.loadPageTree$(this.root, this.depth);
    this.rootDisplayName$ = this.cmsFacade.page$(this.root).pipe(map(page => page?.displayName));
  }
}

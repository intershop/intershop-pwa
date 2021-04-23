import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';

/**
 * The Content Page Navigation Component to get content page hierarchy navigation.
 */
@Component({
  selector: 'ish-content-navigation',
  templateUrl: './content-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentNavigationComponent implements OnInit, OnChanges {
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
    if (this.root) {
      this.contentPageTreeView$ = this.cmsFacade.loadPageTreeView$(this.root, this.depth);
      this.rootDisplayName$ = this.cmsFacade.pageTreeElement$(this.root).pipe(map(tree => tree.name));
    }
  }
}

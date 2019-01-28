import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentPageView } from 'ish-core/models/content-view/content-views';
import { LoadContentPage, getContentPage } from 'ish-core/store/content/pages';

/**
 * The Content Page Container Component prepares all data required to display content managed pages.
 * uses {@link ContentPageComponent} to display content managed pages
 */
@Component({
  templateUrl: './content-page.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ContentPageContainerComponent implements OnInit {
  contentPageId$ = this.route.params.pipe(map(params => params.contentPageId));

  contentPage$: Observable<ContentPageView>;

  constructor(private route: ActivatedRoute, private store: Store<{}>) {}

  ngOnInit(): void {
    this.contentPageId$.subscribe(pageId => {
      this.store.dispatch(new LoadContentPage({ id: pageId }));
      this.contentPage$ = this.store.pipe(select(getContentPage, pageId));
    });
  }
}

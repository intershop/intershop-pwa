import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getContentPageLoading, getSelectedContentPage } from 'ish-core/store/content/pages';

/**
 * The Content Page Container Component fetches the data required to render CMS managed pages.
 * uses {@link ContentPageComponent} to display the CMS content
 */
@Component({
  templateUrl: './content-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageContainerComponent {
  contentPage$ = this.store.pipe(select(getSelectedContentPage));
  contentPageLoading$ = this.store.pipe(select(getContentPageLoading));

  constructor(private store: Store<{}>) {}
}

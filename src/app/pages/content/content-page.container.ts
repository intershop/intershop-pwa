import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';

/**
 * The Content Page Container Component fetches the data required to render CMS managed pages.
 * uses {@link ContentPageComponent} to display the CMS content
 */
@Component({
  templateUrl: './content-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageContainerComponent implements OnInit {
  contentPage$: Observable<ContentPageletEntryPointView>;
  contentPageLoading$: Observable<boolean>;

  constructor(private cmsFacade: CMSFacade) {}

  ngOnInit() {
    this.contentPage$ = this.cmsFacade.contentPage$;
    this.contentPageLoading$ = this.cmsFacade.contentPageLoading$;
  }
}

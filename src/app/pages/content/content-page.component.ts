import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';

/**
 * The Content Page Component fetches and renders the data of CMS managed pages.
 */
@Component({
  templateUrl: './content-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageComponent implements OnInit {
  contentPage$: Observable<ContentPageletEntryPointView>;
  contentPageLoading$: Observable<boolean>;

  constructor(private cmsFacade: CMSFacade) {}

  ngOnInit() {
    this.contentPage$ = this.cmsFacade.contentPage$;
    this.contentPageLoading$ = this.cmsFacade.contentPageLoading$;
  }
}

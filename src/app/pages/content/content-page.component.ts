import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { ContentPageletComponent } from 'ish-shared/cms/components/content-pagelet/content-pagelet.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

/**
 * The Content Page Component fetches and renders the data of CMS managed pages.
 */
@Component({
  templateUrl: './content-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ContentPageletComponent, LoadingComponent, NgIf, AsyncPipe],
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

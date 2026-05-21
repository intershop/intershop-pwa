import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-account-content-page',
  standalone: false,
  templateUrl: './account-content-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountContentPageComponent implements OnInit {
  contentPage$: Observable<ContentPageletEntryPointView>;
  contentPageLoading$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);

  constructor(private cmsFacade: CMSFacade) {}

  ngOnInit() {
    this.contentPage$ = this.cmsFacade.contentPage$;
    this.contentPageLoading$ = this.cmsFacade.contentPageLoading$;

    // set breadcrumb data for account content pages
    this.contentPage$.pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef)).subscribe(contentPage => {
      this.cmsFacade.setBreadcrumbForContentPage(contentPage.id);
    });
  }
}

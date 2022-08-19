import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

/**
 * The CMS Static Page Component to render CMS managed static content pages.
 * With optional side panel and content page hierarchy navigation.
 */
@Component({
  selector: 'ish-cms-static-page',
  templateUrl: './cms-static-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSStaticPageComponent implements CMSComponent, OnChanges {
  @Input() pagelet: ContentPageletView;

  contentPageTree$: Observable<ContentPageTreeView>;
  contentPageTreeLoading$: Observable<boolean>;
  contentPageTreeError$: Observable<HttpError>;

  constructor(private cmsFacade: CMSFacade) {}

  ngOnChanges() {
    if (this.pagelet?.stringParam('NavigationRoot')) {
      this.contentPageTree$ = this.cmsFacade.contentPageTree$(
        this.pagelet.stringParam('NavigationRoot'),
        this.pagelet.numberParam('NavigationDepth')
      );
    }

    this.contentPageTreeLoading$ = this.cmsFacade.contentPageTreeLoading$;
    this.contentPageTreeError$ = this.cmsFacade.contentPageTreeError$;
  }
}

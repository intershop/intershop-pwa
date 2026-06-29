import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ContentNavigationComponent } from 'ish-shared/cms/components/content-navigation/content-navigation.component';
import { ContentSlotComponent } from 'ish-shared/cms/components/content-slot/content-slot.component';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';

/**
 * The CMS Static Page Component to render CMS managed static content pages.
 * With optional side panel and content page hierarchy navigation.
 */
@Component({
  selector: 'ish-cms-static-page',
  imports: [AsyncPipe, BreadcrumbComponent, ContentNavigationComponent, ContentSlotComponent],
  standalone: true,
  templateUrl: './cms-static-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSStaticPageComponent implements CMSComponent, OnChanges {
  @Input({ required: true }) pagelet: ContentPageletView;

  contentPageTree$: Observable<ContentPageTreeView>;

  constructor(private cmsFacade: CMSFacade) {}

  ngOnChanges() {
    if (this.pagelet?.stringParam('NavigationRoot')) {
      this.contentPageTree$ = this.cmsFacade.contentPageTree$(
        this.pagelet.stringParam('NavigationRoot'),
        this.pagelet.numberParam('NavigationDepth', 0)
      );
    }

    // explicitly set breadcrumb data for content pages that use the Static Content component
    // to have the complete breadcrumb data it is necessary that the content page tree
    // was fetched for the given 'NavigationRoot' even if the navigation is not shown in the side panel
    this.cmsFacade.setBreadcrumbForContentPage(this.pagelet?.stringParam('NavigationRoot'));
  }
}

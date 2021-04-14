import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

/**
 * The CMS Static Page Component to render CMS managed static content pages.
 * With optional side panel and (TODO: content page hierarchy navigation)
 */
@Component({
  selector: 'ish-cms-static-page',
  templateUrl: './cms-static-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSStaticPageComponent implements CMSComponent, OnChanges {
  constructor(private cmsFacade: CMSFacade) {}

  @Input() pagelet: ContentPageletView;
  depth: number;

  ngOnChanges() {
    // load page tree, if pagelet should show navigation
    if (this.pagelet && this.pagelet.booleanParam('ShowNavigation')) {
      this.depth = Number(this.pagelet.stringParam('NavigationDepth'));
      this.cmsFacade.loadPageTree(
        this.pagelet.stringParam('NavigationRoot'),
        this.pagelet.stringParam('NavigationDepth')
      );
    }
  }
}

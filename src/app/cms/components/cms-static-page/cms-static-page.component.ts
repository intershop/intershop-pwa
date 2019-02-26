import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';

/**
 * The CMS Static Page Component to render CMS managed static content pages.
 * With optional side panel and (TODO: content page hierarchy navigation)
 */
@Component({
  selector: 'ish-cms-static-page',
  templateUrl: './cms-static-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSStaticPageComponent {
  @Input() pagelet: ContentPageletView;
}

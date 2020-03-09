import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

/**
 * The CMS Landing Page Component to render CMS managed content
 * that is wrapped within a landing page component.
 */
@Component({
  selector: 'ish-cms-landing-page',
  templateUrl: './cms-landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSLandingPageComponent implements CMSComponent {
  @Input() pagelet: ContentPageletView;
}

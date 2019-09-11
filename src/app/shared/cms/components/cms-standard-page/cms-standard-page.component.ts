import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

/**
 * The CMS Standard Page Component to render CMS content of the 'Standard Page' page variant model.
 * Note: For the PWA the it only renders the content of the 'content' slot.
 * The 'header' and 'footer' slot content is not rendered.
 */
@Component({
  selector: 'ish-cms-standard-page',
  templateUrl: './cms-standard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSStandardPageComponent implements CMSComponent {
  @Input() pagelet: ContentPageletView;
}

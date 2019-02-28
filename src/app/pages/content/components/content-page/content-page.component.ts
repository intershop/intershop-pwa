import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentEntryPointView } from 'ish-core/models/content-view/content-views';

/**
 * The Content Page Component renders the CMS content of a given content page.
 */
@Component({
  selector: 'ish-content-page',
  templateUrl: './content-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPageComponent {
  @Input() contentPage: ContentEntryPointView;
}

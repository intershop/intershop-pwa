import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from '../../../models/content-view/content-views';

// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-cms-text',
  templateUrl: './cms-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSTextComponent {
  @Input()
  pagelet: ContentPageletView;
}

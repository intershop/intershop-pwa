import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from '../../../models/content-view/content-views';

@Component({
  selector: 'ish-cms-freestyle',
  templateUrl: './cms-freestyle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSFreestyleComponent {
  @Input()
  pagelet: ContentPageletView;
}

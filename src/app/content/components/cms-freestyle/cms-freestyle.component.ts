import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from '../../../models/content-view/content-views';

// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-cms-freestyle',
  templateUrl: './cms-freestyle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSFreestyleComponent {
  @Input()
  pagelet: ContentPageletView;
}

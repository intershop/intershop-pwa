import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { CMSComponent } from '../../models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-dialog',
  templateUrl: './cms-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSDialogComponent implements CMSComponent {
  @Input() pagelet: ContentPageletView;
}

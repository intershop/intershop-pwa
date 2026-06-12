import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-dialog',
  templateUrl: './cms-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSDialogComponent implements CMSComponent {
  @Input() pagelet: ContentPageletView;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-freestyle',
  templateUrl: './cms-freestyle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSFreestyleComponent implements CMSComponent {
  @Input() pagelet: ContentPageletView;
}

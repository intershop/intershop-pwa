import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ContentSlotComponent } from 'ish-shared/cms/components/content-slot/content-slot.component';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-dialog',
  templateUrl: './cms-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ServerHtmlDirective, ContentSlotComponent],
})
export class CMSDialogComponent implements CMSComponent {
  @Input() pagelet: ContentPageletView;
}

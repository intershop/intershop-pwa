
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-text',
  templateUrl: './cms-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ ServerHtmlDirective],
})
export class CMSTextComponent implements CMSComponent {
  @Input({ required: true }) pagelet: ContentPageletView;
}

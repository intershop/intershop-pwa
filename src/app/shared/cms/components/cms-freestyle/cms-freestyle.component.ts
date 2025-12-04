import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-freestyle',
  templateUrl: './cms-freestyle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, ServerHtmlDirective],
})
export class CMSFreestyleComponent implements CMSComponent {
  @Input({ required: true }) pagelet: ContentPageletView;
}

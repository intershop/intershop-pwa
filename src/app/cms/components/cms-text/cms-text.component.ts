import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';

@Component({
  selector: 'ish-cms-text',
  templateUrl: './cms-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSTextComponent {
  @Input() pagelet: ContentPageletView;
}

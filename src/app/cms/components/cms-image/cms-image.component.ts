import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentViewHelper } from 'ish-core/models/content-view/content-view.helper';
import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { CMSComponent } from '../../models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-image',
  templateUrl: './cms-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSImageComponent implements CMSComponent {
  @Input() pagelet: ContentPageletView;

  routerLink = ContentViewHelper.getRouterLink;
}

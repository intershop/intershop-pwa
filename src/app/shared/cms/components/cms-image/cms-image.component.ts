import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ContentViewHelper } from 'ish-core/models/content-view/content-view.helper';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-image',
  templateUrl: './cms-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgClass, RouterLink, NgTemplateOutlet, TranslatePipe],
})
export class CMSImageComponent implements CMSComponent {
  @Input({ required: true }) pagelet: ContentPageletView;

  isRouterLink = ContentViewHelper.isRouterLink;
  routerLink = ContentViewHelper.getRouterLink;
}

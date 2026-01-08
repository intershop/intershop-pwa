import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ContentViewHelper } from 'ish-core/models/content-view/content-view.helper';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ImageLoading } from 'ish-core/models/image/image.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-image-enhanced',
  templateUrl: './cms-image-enhanced.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, RouterLink, NgTemplateOutlet, NgClass, ServerHtmlDirective, TranslateModule],
})
export class CMSImageEnhancedComponent implements CMSComponent {
  @Input({ required: true }) pagelet: ContentPageletView;

  isRouterLink = ContentViewHelper.isRouterLink;
  routerLink = ContentViewHelper.getRouterLink;

  /**
   * Getter method to decide whether the image is loading 'lazy' or 'eager'
   * based on the presence of the CSS class 'loading-lazy' in the pagelet configuration.
   */
  get loading(): ImageLoading {
    return this.pagelet.stringParam('CSSClass')?.includes('loading-lazy') ? 'lazy' : 'eager';
  }
}

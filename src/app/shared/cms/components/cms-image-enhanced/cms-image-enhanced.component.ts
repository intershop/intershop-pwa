import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentViewHelper } from 'ish-core/models/content-view/content-view.helper';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-image-enhanced',
  templateUrl: './cms-image-enhanced.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSImageEnhancedComponent implements CMSComponent {
  @Input({ required: true }) pagelet: ContentPageletView;

  isRouterLink = ContentViewHelper.isRouterLink;
  routerLink = ContentViewHelper.getRouterLink;

  /**
   * Getter method to decide whether the image is loading 'lazy' or 'eager'
   * based on the presence of the CSS class 'loading-lazy' in the pagelet configuration.
   */
  get loading(): 'lazy' | 'eager' {
    return this.pagelet.stringParam('CSSClass')?.includes('loading-lazy') ? 'lazy' : 'eager';
  }
}

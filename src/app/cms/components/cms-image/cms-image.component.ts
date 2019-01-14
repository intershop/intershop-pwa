import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContentViewHelper } from 'ish-core/models/content-view/content-view.helper';
import { CMSComponentBase } from '../cms-component-base/cms-component-base';

@Component({
  selector: 'ish-cms-image',
  templateUrl: './cms-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSImageComponent extends CMSComponentBase {
  routerLink = ContentViewHelper.getRouterLink;
}

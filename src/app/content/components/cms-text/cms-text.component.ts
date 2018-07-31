import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentPageletHelper } from '../../../models/content-pagelet/content-pagelet.helper';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';

// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-cms-text',
  templateUrl: './cms-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSTextComponent {
  @Input()
  pagelet: ContentPagelet;

  getConfigurationParameterValue = ContentPageletHelper.getConfigurationParameterValue;
}

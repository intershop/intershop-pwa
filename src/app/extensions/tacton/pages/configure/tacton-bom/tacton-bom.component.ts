import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TactonProductConfigurationBomItem } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-tacton-bom',
  templateUrl: './tacton-bom.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonBomComponent {
  @Input() bom: TactonProductConfigurationBomItem[];
}

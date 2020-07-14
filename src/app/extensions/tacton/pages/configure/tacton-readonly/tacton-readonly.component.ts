import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-tacton-readonly',
  templateUrl: './tacton-readonly.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonReadonlyComponent {
  @Input() parameter: TactonProductConfigurationParameter;
}

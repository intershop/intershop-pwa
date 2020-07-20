import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TactonProductConfigurationHelper } from '../../../models/tacton-product-configuration/tacton-product-configuration.helper';
import { TactonProductConfigurationGroup } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-tacton-group',
  templateUrl: './tacton-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonGroupComponent {
  @Input() group: TactonProductConfigurationGroup;

  isGroup = TactonProductConfigurationHelper.isGroup;
  isNumberInput = TactonProductConfigurationHelper.isNumberInput;
  isTextInput = TactonProductConfigurationHelper.isTextInput;
  isSelectInput = TactonProductConfigurationHelper.isSelectInput;
  isReadOnly = TactonProductConfigurationHelper.isReadOnly;
  isRadioInput = TactonProductConfigurationHelper.isRadioInput;
  isImageTextButtons = TactonProductConfigurationHelper.isImageTextButtons;
}

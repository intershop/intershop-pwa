import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationHelper } from '../../../models/tacton-product-configuration/tacton-product-configuration.helper';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-tacton-parameter',
  templateUrl: './tacton-parameter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonParameterComponent {
  @Input() item: TactonProductConfigurationParameter;

  constructor(private facade: TactonFacade) {}

  isNumberInput = TactonProductConfigurationHelper.isNumberInput;
  isTextInput = TactonProductConfigurationHelper.isTextInput;
  isSelectInput = TactonProductConfigurationHelper.isSelectInput;
  isReadOnly = TactonProductConfigurationHelper.isReadOnly;
  isRadioInput = TactonProductConfigurationHelper.isRadioInput;
  isImageTextButtons = TactonProductConfigurationHelper.isImageTextButtons;
  isSelectedImage = TactonProductConfigurationHelper.isSelectedImage;
  isTextButtons = TactonProductConfigurationHelper.isTextButtons;

  uncommit() {
    this.facade.uncommitValue(this.item);
  }
}

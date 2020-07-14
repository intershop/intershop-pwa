import {
  TactonProductConfigurationGroup,
  TactonProductConfigurationParameter,
} from './tacton-product-configuration.model';

export class TactonProductConfigurationHelper {
  static isGroup(
    el: TactonProductConfigurationGroup | TactonProductConfigurationParameter
  ): el is TactonProductConfigurationGroup {
    return el.isGroup;
  }

  private static isParameter(
    el: TactonProductConfigurationGroup | TactonProductConfigurationParameter
  ): el is TactonProductConfigurationParameter {
    return el.isParameter;
  }

  static isNumberInput(el: TactonProductConfigurationGroup | TactonProductConfigurationParameter): boolean {
    return (
      TactonProductConfigurationHelper.isParameter(el) &&
      el.properties.guitype === 'text' &&
      !!el.domain?.max &&
      !!el.domain?.min
    );
  }

  static isTextInput(el: TactonProductConfigurationGroup | TactonProductConfigurationParameter): boolean {
    return (
      TactonProductConfigurationHelper.isParameter(el) &&
      el.properties.guitype === 'text' &&
      !el.domain?.max &&
      !el.domain?.min
    );
  }

  static isSelectInput(el: TactonProductConfigurationGroup | TactonProductConfigurationParameter): boolean {
    return TactonProductConfigurationHelper.isParameter(el) && el.properties.guitype === 'dropdown';
  }

  static isReadOnly(el: TactonProductConfigurationGroup | TactonProductConfigurationParameter): boolean {
    return TactonProductConfigurationHelper.isParameter(el) && el.properties.guitype === 'readonly';
  }

  static isRadioInput(el: TactonProductConfigurationGroup | TactonProductConfigurationParameter): boolean {
    return TactonProductConfigurationHelper.isParameter(el) && el.properties.guitype === 'radio';
  }
}

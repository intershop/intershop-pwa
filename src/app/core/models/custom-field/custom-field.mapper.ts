import { CustomFieldData } from './custom-field.interface';
import { CustomFields } from './custom-field.model';

export class CustomFieldMapper {
  static fromData(customFieldData: CustomFieldData[] = []): CustomFields {
    return customFieldData.filter(CustomFieldMapper.hasValue).reduce<CustomFields>((customFields, customField) => {
      customFields[customField.name] = customField.value;
      return customFields;
    }, {});
  }

  private static hasValue(customFieldData: CustomFieldData): boolean {
    if (customFieldData.type === 'String') {
      return !!customFieldData.value;
    }
    // eslint-disable-next-line unicorn/no-null
    return customFieldData.value !== null;
  }
}

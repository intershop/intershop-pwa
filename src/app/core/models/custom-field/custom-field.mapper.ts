import { CustomFieldDefinition } from 'ish-core/models/custom-field-definition/custom-field-definition.model';

import { CustomFieldData } from './custom-field.interface';
import { CustomFields } from './custom-field.model';

export class CustomFieldMapper {
  static fromData(customFieldData: CustomFieldData[] = []): CustomFields {
    return customFieldData.filter(CustomFieldMapper.hasValue).reduce<CustomFields>((customFields, customField) => {
      customFields[customField.name] = customField.value;
      return customFields;
    }, {});
  }

  static toData(customFields: CustomFields, definitions: CustomFieldDefinition[]): CustomFieldData[] {
    if (!customFields || !definitions?.length) {
      return [];
    }

    return definitions.map(definition => ({
      name: definition.name,
      value: customFields[definition.name] || '',
      type: definition.type,
    }));
  }

  private static hasValue(customFieldData: CustomFieldData): boolean {
    if (customFieldData.type === 'String') {
      return !!customFieldData.value;
    }
    // eslint-disable-next-line unicorn/no-null
    return customFieldData.value !== null;
  }
}

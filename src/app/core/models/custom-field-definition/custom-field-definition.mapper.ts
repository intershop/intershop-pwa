import { CustomFieldDefinitionsData } from './custom-field-definition.interface';
import { CustomFieldDefinitions } from './custom-field-definition.model';

export class CustomFieldDefinitionMapper {
  static fromData(data: CustomFieldDefinitionsData[] = []): CustomFieldDefinitions {
    const entities = data.reduce<CustomFieldDefinitions['entities']>(
      (acc, entry) => ({
        ...acc,
        [entry.name]: {
          description: entry.description,
          displayName: entry.displayName,
          name: entry.name,
          type: entry.type,
        },
      }),
      {}
    );

    const scopes = data
      .sort((a, b) => a.position - b.position)
      .reduce<CustomFieldDefinitions['scopes']>((acc, entry) => {
        entry.scopes.forEach(scope => {
          if (!scope.isVisible) {
            return;
          }
          if (!acc[scope.name]) {
            acc[scope.name] = [];
          }
          acc[scope.name].push({
            name: entry.name,
            editable: scope.isEditable,
          });
        });
        return acc;
      }, {});

    return { entities, scopes };
  }
}

import { omit } from 'ish-core/utils/functions';

import { CustomFieldDefinitionsData, ServerConfigData, ServerConfigDataEntry } from './server-config.interface';
import { CustomFieldDefinitions, ServerConfig } from './server-config.model';

export class ServerConfigMapper {
  static fromData(payload: ServerConfigData): [ServerConfig, CustomFieldDefinitions | undefined] {
    if (payload?.data) {
      const config = ServerConfigMapper.mapEntries(omit(payload.data, 'customFieldDefinitions'));
      const definitions = ServerConfigMapper.mapCustomFields(payload.data.customFieldDefinitions);
      return [config, definitions];
    }
    return [{}, undefined];
  }

  private static transformType(val: unknown) {
    if (typeof val === 'string') {
      if (!isNaN(+val)) {
        return +val;
      } else if (val === 'true') {
        return true;
      } else if (val === 'false') {
        return false;
      }
    }
    return val;
  }

  private static mapEntries(entries: ServerConfigDataEntry): ServerConfig {
    return Object.entries(entries).reduce(
      (acc, entry) => ({
        ...acc,
        [entry[0]]:
          // eslint-disable-next-line unicorn/no-null
          entry[1] !== null && typeof entry[1] === 'object' && !Array.isArray(entry[1])
            ? // do recursion if we find an object
              ServerConfigMapper.mapEntries(
                // get rid of id
                omit(entry[1], 'id')
              )
            : // improve data quality
              ServerConfigMapper.transformType(entry[1]),
      }),
      {}
    );
  }

  private static mapCustomFields(data: CustomFieldDefinitionsData[] = []): CustomFieldDefinitions {
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

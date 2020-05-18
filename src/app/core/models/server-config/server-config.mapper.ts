import { mapValues, omit } from 'lodash-es';

import { ServerConfigData, ServerConfigDataEntry } from './server-config.interface';
import { ServerConfig } from './server-config.model';

export class ServerConfigMapper {
  private static transformType(val) {
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

  private static mapEntries(entries: ServerConfigDataEntry[]) {
    return entries.reduce(
      (acc, entry) => ({
        ...acc,
        [entry.id]: Array.isArray(entry.elements)
          ? // do recursion if elements array is set
            ServerConfigMapper.mapEntries(entry.elements)
          : mapValues(
              // filter out unnecessary 'id' attribute
              omit(entry, 'id'),
              // transform string types to better values
              ServerConfigMapper.transformType
            ),
      }),
      {}
    );
  }

  static fromData(payload: ServerConfigData): ServerConfig {
    if (payload && payload.data) {
      return ServerConfigMapper.mapEntries(payload.data);
    }
    return {};
  }
}

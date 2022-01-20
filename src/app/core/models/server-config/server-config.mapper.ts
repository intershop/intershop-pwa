import { omit } from 'ish-core/utils/functions';

import { ServerConfigData, ServerConfigDataEntry } from './server-config.interface';
import { ServerConfig } from './server-config.model';

export class ServerConfigMapper {
  static fromData(payload: ServerConfigData): ServerConfig {
    if (payload?.data) {
      return ServerConfigMapper.mapEntries(payload.data);
    }
    return {};
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
}

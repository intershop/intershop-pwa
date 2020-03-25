import { omit } from 'lodash-es';

import { ServerConfigData, ServerConfigDataEntry } from './server-config.interface';
import { ServerConfig } from './server-config.model';

export class ServerConfigMapper {
  private static mapEntries(entries: ServerConfigDataEntry[]) {
    return entries.reduce(
      (acc, entry) => ({
        ...acc,
        [entry.id]: Array.isArray(entry.elements)
          ? // do recursion if elements array is set
            ServerConfigMapper.mapEntries(entry.elements)
          : // filter out unnecessary 'id' attribute
            omit(entry, 'id'),
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

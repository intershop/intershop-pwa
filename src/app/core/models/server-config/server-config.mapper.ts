import { ServerConfigData } from './server-config.interface';
import { ServerConfig } from './server-config.model';

export class ServerConfigMapper {
  static fromData(payload: ServerConfigData): ServerConfig {
    const { data } = payload;

    const config = {};

    if (data && data.length) {
      data.forEach(cdata => {
        if (cdata && cdata.id) {
          config[cdata.id] = cdata;
        }
      });
      return config;
    }
    return;
  }
}

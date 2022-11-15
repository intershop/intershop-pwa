import { Injectable } from '@angular/core';

import { CxmlConfigurationData } from './cxml-configuration.interface';
import { CxmlConfiguration } from './cxml-configuration.model';

@Injectable({ providedIn: 'root' })
export class CxmlConfigurationMapper {
  static fromData(cxmlConfigurationData: CxmlConfigurationData): CxmlConfiguration[] {
    if (cxmlConfigurationData) {
      const { data, info } = cxmlConfigurationData;

      return data?.map(cxmlConfiguration => {
        const infoElement = info?.metaData.find(e => e.name === cxmlConfiguration.name);
        return {
          ...cxmlConfiguration,
          defaultValue: infoElement?.defaultValue,
          description: infoElement?.description,
          inputType: infoElement?.inputType,
        };
      });
    } else {
      throw new Error(`CxmlConfigurationData is required`);
    }
  }
}

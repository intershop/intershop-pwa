import { RegionData } from './region.interface';
import { Region } from './region.model';

export class RegionMapper {
  static fromData(data: RegionData, countryCode: string): Region {
    if (data && countryCode) {
      return {
        countryCode,
        regionCode: data.id,
        name: data.name,
        id: countryCode.concat('_'.concat(data.id)),
      };
    } else {
      throw new Error(`'RegionData' and 'countryCode' are required for the mapping`);
    }
  }
}
